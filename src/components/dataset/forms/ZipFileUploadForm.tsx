"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadIcon, XIcon } from "lucide-react";
import React, { useCallback } from "react";
import type { FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { abbreviateFileSize, cn } from "@/lib/utils";

const formSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  zipFile: z.instanceof(File, { message: "A zip file is required" }).nullable(),
});

type FormData = z.infer<typeof formSchema>;

export function ZipFileUploadForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", zipFile: null },
  });

  const zipFile = form.watch("zipFile");

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
      const message =
        fileRejections[0].errors[0]?.message || "File upload failed";
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

  const onSubmit = (values: FormData) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Dataset Title</FormLabel>
              <FormControl>
                <Input pill={false} className="font-bold" {...field} />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zipFile"
          render={() => (
            <FormItem>
              <FormLabel className="text-lg">Zip File</FormLabel>
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
                      <div className="text-lg font-bold">
                        Drag & drop a file to upload
                      </div>
                      <div className="text-muted-foreground">or</div>
                      <Button variant="outline" tabIndex={-1} type="button">
                        Browse file
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
          variant="gold"
          className="lift w-full"
          disabled={form.formState.isSubmitting || !zipFile}
        >
          {form.formState.isSubmitting ? <Spinner /> : <UploadIcon />} Upload
        </Button>
      </form>
    </Form>
  );
}
