import type { AxiosProgressEvent } from "axios";
import { FolderArchiveIcon, UploadIcon, XIcon } from "lucide-react";
import { useCallback } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

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

import type { formSchema } from "./ZipFileUploadForm";

interface ZipFileUploadFormItemProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  pending: boolean;
  uploadProgress?: AxiosProgressEvent;
  cancelUpload: () => void;
}

export function ZipFileUploadFormItem({
  form,
  pending,
  uploadProgress,
  cancelUpload,
}: ZipFileUploadFormItemProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        form.clearErrors("zipFile");
        form.setValue("zipFile", acceptedFiles[0], { shouldValidate: true });
      }
    },
    [form],
  );
  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      let message;
      switch (fileRejections[0].errors[0]?.code) {
        case "file-invalid-type":
          message = "File type must be .zip";
          break;
        case "file-too-large":
          message = "Maximum upload size is 1GB.";
          break;
        default:
          message = "An error occurred while uploading the file.";
          break;
      }
      form.setError("zipFile", { type: "manual", message });
    },
    [form],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept: { "application/zip": [".zip"] },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 1024,
  });
  const zipFile = form.watch("zipFile");
  return (
    <FormField
      control={form.control}
      name="zipFile"
      render={() => (
        <FormItem>
          <FormControl>
            <div
              {...getRootProps()}
              className={cn(
                "flex h-44 items-center justify-center rounded-md border-2 border-dashed p-6 text-center",
                { "bg-uci-blue/10": isDragActive },
                { "cursor-pointer": !zipFile },
              )}
            >
              <input {...getInputProps()} disabled={!!zipFile || pending} />
              {isDragActive ? (
                <div className="flex flex-col items-center space-y-2">
                  <UploadIcon />
                  <div>Drop to upload file</div>
                </div>
              ) : zipFile ? (
                <div className="flex w-full items-center justify-between space-x-1">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <FolderArchiveIcon className="shrink-0" />
                    <span className="truncate text-lg font-bold">
                      {zipFile.name}
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
                        {abbreviateFileSize(zipFile.size)}
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
                  <FormLabel className="text-pretty text-lg font-bold">
                    Drag & drop a file to upload (.zip)
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
