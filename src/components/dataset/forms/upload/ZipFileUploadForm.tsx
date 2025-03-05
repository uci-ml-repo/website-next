"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosProgressEvent } from "axios";
import axios from "axios";
import { UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFilesStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { ZipFileUploadFormItem } from "@/components/dataset/forms/upload/ZipFileUploadFormItem";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import {
  DATASET_API_ZIP_PENDING_ROUTE,
  DATASET_API_ZIP_ROUTE,
  DATASET_FILES_ZIP_PATH,
} from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

export const formSchema = z.object({
  zipFile: z.instanceof(File, { message: "A zip file is required" }),
});

export function ZipFileUploadForm({
  dataset,
  requireApproval,
}: {
  dataset: DatasetResponse;
  requireApproval?: boolean;
}) {
  const { setEditingFiles } = useDataset();
  const { setFilesStatus, setFileCount, setSize } = useDatasetFilesStatus();

  const [uploadProgress, setUploadProgress] = useState<AxiosProgressEvent>();
  const controllerRef = useRef<AbortController | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { zipFile: undefined },
  });

  const unzipMutation = trpc.file.zip.unzip.useMutation({
    onSuccess: (response) => {
      if (response.success) {
        setFilesStatus("unzipped");
      } else {
        setFilesStatus("not-unzipped");
      }
      setFileCount(response.dataset.fileCount);
      setSize(response.dataset.size);
      setEditingFiles(false);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.zipFile) return;

    controllerRef.current = new AbortController();

    try {
      await axios.putForm(
        requireApproval
          ? DATASET_API_ZIP_PENDING_ROUTE(dataset)
          : DATASET_API_ZIP_ROUTE(dataset),
        { file: values.zipFile },
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            setUploadProgress(progressEvent);
          },
          signal: controllerRef.current.signal,
        },
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error uploading dataset",
        description: (error as Error).message,
      });
      return;
    }

    if (!requireApproval) {
      setFilesStatus("processing");

      unzipMutation.mutate({
        path: DATASET_FILES_ZIP_PATH(dataset),
        datasetId: dataset.id,
        overwrite: true,
      });
    }
  }

  function cancelUpload() {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setUploadProgress(undefined);
    }
  }

  const pending =
    form.formState.isSubmitting || form.formState.isSubmitSuccessful;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ZipFileUploadFormItem
          form={form}
          pending={pending}
          uploadProgress={uploadProgress}
          cancelUpload={cancelUpload}
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
