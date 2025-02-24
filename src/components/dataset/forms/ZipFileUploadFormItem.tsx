"use client";

import { UploadIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useCallback } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import type { useForm } from "react-hook-form";

import type { FormData } from "@/components/dataset/forms/DatasetUploadForm";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CONTACT_ROUTE } from "@/lib/routes";
import { abbreviateFileSize, cn } from "@/lib/utils";

export function ZipFileUploadFormItem({
  form,
}: {
  form: ReturnType<typeof useForm<FormData>>;
}) {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept: { "application/zip": [".zip"] },
    maxFiles: 1,
    maxSize: 512 * 1024 * 1024,
  });

  const zipFile = form.watch("zipFile");

  return (
    <FormItem>
      <FormLabel className="text-lg">Upload Data</FormLabel>
      <div className="space-y-2 pb-2 text-muted-foreground">
        <p>
          Please upload a single zip file containing the entire contents of your
          dataset, including any additional files and documentation.
        </p>
        <p>
          Note: the maximum upload size is 512MB. If your dataset is larger than
          this, please{" "}
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
          <input {...getInputProps()} disabled={!!zipFile} />
          {isDragActive ? (
            <div className="flex flex-col items-center space-y-2">
              <UploadIcon />
              <div>Drop to upload file</div>
            </div>
          ) : zipFile ? (
            <div className="flex w-full items-center justify-between space-x-1">
              <span className="space-x-1 truncate text-lg font-bold">
                {zipFile.name}
              </span>
              <span className="flex flex-1 justify-start text-nowrap text-muted-foreground">
                ({abbreviateFileSize(zipFile.size)})
              </span>
              <Button
                variant="outline-destructive"
                size="icon"
                className="shrink-0"
                onClick={(event) => {
                  form.setValue("zipFile", null);
                  event.stopPropagation();
                }}
              >
                <XIcon />
              </Button>
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
  );
}
