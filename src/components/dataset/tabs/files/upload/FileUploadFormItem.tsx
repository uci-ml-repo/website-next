import type { AxiosProgressEvent } from "axios";
import { UploadIcon, XIcon } from "lucide-react";
import { useCallback } from "react";
import type { Accept, FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProgressCircle } from "@/components/ui/progress-circle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { abbreviateFileSize, abbreviateTime, cn } from "@/lib/utils";

interface FileUploadFormItemProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  accept?: Accept;
  pending: boolean;
  uploadProgress?: AxiosProgressEvent;
  cancelUpload: () => void;
  maxUploadSize?: number;
  fileIcon?: React.ReactNode;
}

export const formSchema = z.object({
  file: z.instanceof(File, { message: "A file is required" }),
});

export function FileUploadFormItem({
  form,
  accept,
  pending,
  uploadProgress,
  cancelUpload,
  maxUploadSize = 1024 * 1024 * 1024, // 1GB
  fileIcon,
}: FileUploadFormItemProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        form.clearErrors("file");
        form.setValue("file", acceptedFiles[0], { shouldValidate: true });
      }
    },
    [form],
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      form.setError("file", {
        type: "manual",
        message: fileRejections[0].errors[0]?.message,
      });
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept,
    maxFiles: 1,
    maxSize: maxUploadSize,
  });

  const file = form.watch("file");

  return (
    <FormField
      control={form.control}
      name="file"
      render={() => (
        <FormItem>
          <FormControl>
            <div
              {...getRootProps()}
              className={cn(
                "flex h-44 items-center justify-center rounded-md border-2 border-dashed p-6 text-center",
                { "bg-uci-blue/10": isDragActive },
                { "cursor-pointer": !file },
              )}
            >
              <input {...getInputProps()} disabled={!!file || pending} />
              {isDragActive ? (
                <div className="flex flex-col items-center space-y-2">
                  <UploadIcon />
                  <div>Drop to upload file</div>
                </div>
              ) : file ? (
                <div className="flex w-full items-center justify-between space-x-1">
                  <div className="flex items-center space-x-2 overflow-hidden [&>svg]:shrink-0">
                    {fileIcon}
                    <span className="truncate text-lg font-bold">
                      {file.name}
                    </span>
                  </div>
                  {uploadProgress ? (
                    <div className="flex items-center text-muted-foreground">
                      {uploadProgress.loaded && uploadProgress.total && (
                        <div className="mr-2 text-nowrap">
                          {abbreviateFileSize(uploadProgress.loaded)}/
                          {abbreviateFileSize(uploadProgress.total)}
                        </div>
                      )}
                      {uploadProgress.estimated &&
                        uploadProgress.estimated > 0 && (
                          <div>
                            ({abbreviateTime(uploadProgress.estimated)})
                          </div>
                        )}
                      {uploadProgress.progress && (
                        <ProgressCircle progress={uploadProgress.progress} />
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={cancelUpload}
                            className={cn({
                              invisible: uploadProgress.progress === 1,
                            })}
                          >
                            <XIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cancel Upload</TooltipContent>
                      </Tooltip>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="text-nowrap text-muted-foreground">
                        {abbreviateFileSize(file.size)}
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline-destructive"
                            size="icon"
                            className="shrink-0"
                            onClick={(event) => {
                              form.reset();
                              event.stopPropagation();
                            }}
                            disabled={pending}
                          >
                            <XIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove file</TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <FormLabel>
                    <div className="text-pretty text-lg font-bold">
                      Drag & drop a file to upload
                    </div>
                    {accept && (
                      <div className="leading-snug">
                        ({Object.values(accept).flat().join(", ")})
                      </div>
                    )}
                  </FormLabel>
                  <div className="text-muted-foreground">or</div>
                  <Button variant="outline" tabIndex={-1} type="button">
                    Browse files
                  </Button>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-sm" />
        </FormItem>
      )}
    />
  );
}
