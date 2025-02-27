"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosProgressEvent } from "axios";
import axios from "axios";
import { FolderArchiveIcon, UploadIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useRef } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CONTACT_ROUTE, DATASET_ZIP_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { abbreviateFileSize, abbreviateTime, cn } from "@/lib/utils";

const formSchema = z.object({
  zipFile: z.instanceof(File, { message: "A zip file is required" }).nullable(),
});

export function ZipFileUploadForm({ dataset }: { dataset: DatasetResponse }) {
  const [uploadProgress, setUploadProgress] =
    React.useState<AxiosProgressEvent>();

  const controllerRef = useRef<AbortController | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zipFile: null,
    },
  });

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
          message = "Maximum upload size is 512MB.";
          break;
        default:
          message = "An error occurred while uploading the file.";
          break;
      }

      form.setError("zipFile", { type: "manual", message });
    },
    [form],
  );

  const zipFile = form.watch("zipFile");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.zipFile) return;

    controllerRef.current = new AbortController();

    await axios.putForm(
      DATASET_ZIP_ROUTE(dataset),
      {
        file: values.zipFile,
      },
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(progressEvent);
        },
        signal: controllerRef.current.signal,
      },
    );
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept: { "application/zip": [".zip"] },
    maxFiles: 1,
    maxSize: 512 * 1024 * 1024,
  });

  const pending =
    form.formState.isSubmitting || form.formState.isSubmitSuccessful;

  function cancelUpload() {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setUploadProgress(undefined);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="zipFile"
          render={() => (
            <FormItem>
              <FormLabel className="text-lg">Upload Dataset Files</FormLabel>
              <div className="space-y-2 pb-2 text-muted-foreground">
                <p>
                  Upload a single zip file containing the entire contents of
                  your dataset, including any additional files and
                  documentation.
                </p>
                <p>
                  Note: the maximum upload size is 512MB. If your dataset is
                  larger than this, please{" "}
                  <Link href={CONTACT_ROUTE} className="underline">
                    contact us
                  </Link>
                  .
                </p>
              </div>
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

                      {uploadProgress &&
                      uploadProgress.estimated &&
                      uploadProgress.total &&
                      uploadProgress.progress ? (
                        <div className="flex items-center text-muted-foreground">
                          <div className="mr-2 text-nowrap">
                            {abbreviateFileSize(uploadProgress.loaded)}/
                            {abbreviateFileSize(uploadProgress.total)}
                          </div>
                          {uploadProgress.estimated > 0 && (
                            <div>
                              ({abbreviateTime(uploadProgress.estimated)})
                            </div>
                          )}
                          <ProgressCircle progress={uploadProgress.progress} />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={cancelUpload}
                                type="button"
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
                                  form.setValue("zipFile", null);
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
                      <div className="text-pretty text-lg font-bold">
                        Drag & drop a file to upload (.zip)
                      </div>
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
        <Button
          type="submit"
          className="w-full"
          variant="gold"
          disabled={pending}
        >
          {pending ? <Spinner /> : <UploadIcon />} Upload Dataset
        </Button>
      </form>
    </Form>
  );
}
