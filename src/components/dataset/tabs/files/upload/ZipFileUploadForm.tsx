"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosProgressEvent } from "axios";
import axios from "axios";
import { FolderArchiveIcon, UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFileStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import {
  FileUploadFormItem,
  formSchema,
} from "@/components/dataset/tabs/files/upload/FileUploadFormItem";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Enums } from "@/db/lib/enums";
import {
  DATASET_API_ZIP_PENDING_ROUTE,
  DATASET_API_ZIP_ROUTE,
  DATASET_FILES_ZIP_PATH,
  DATASET_FILES_ZIP_PENDING_PATH,
} from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export function ZipFileUploadForm() {
  const { stopEditingField, dataset, setDataset, setViewPendingFiles } = useDataset();
  const { setFileStatus, setPendingFileStatus } = useDatasetFileStatus();

  const requireApproval = dataset.status !== Enums.ApprovalStatus.DRAFT;

  const [uploadProgress, setUploadProgress] = useState<AxiosProgressEvent>();
  const controllerRef = useRef<AbortController | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  });

  const utils = trpc.useUtils();

  const unzipMutation = trpc.file.zip.unzip.useMutation({
    onSuccess: (response) => {
      if (response.success) {
        setFileStatus("unzipped");
        utils.file.find.list.invalidate().then();
      } else {
        setFileStatus("not-unzipped");
      }
      setDataset({
        ...dataset,
        size: response.dataset.size,
        fileCount: response.dataset.fileCount,
      });
      stopEditingField("files");
      if (requireApproval) {
        setViewPendingFiles(true);
      }
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.file) return;

    controllerRef.current = new AbortController();

    try {
      await axios.putForm(
        requireApproval ? DATASET_API_ZIP_PENDING_ROUTE(dataset) : DATASET_API_ZIP_ROUTE(dataset),
        { file: values.file },
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

    if (requireApproval) {
      setPendingFileStatus("unzipping");
    } else {
      setFileStatus("unzipping");
    }

    unzipMutation.mutate({
      path: requireApproval
        ? DATASET_FILES_ZIP_PENDING_PATH(dataset)
        : DATASET_FILES_ZIP_PATH(dataset),
      datasetId: dataset.id,
      overwrite: true,
      updateZipStats: !requireApproval,
    });
  }

  function cancelUpload() {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setUploadProgress(undefined);
    }
  }

  const pending = form.formState.isSubmitting || form.formState.isSubmitSuccessful;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FileUploadFormItem
          form={form}
          pending={pending}
          uploadProgress={uploadProgress}
          cancelUpload={cancelUpload}
          fileIcon={<FolderArchiveIcon />}
          accept={{ "application/zip": [".zip"] }}
        />
        <Button type="submit" className="lift w-full" variant="gold" disabled={pending}>
          {pending ? <Spinner /> : <UploadIcon />} Upload Dataset
        </Button>
      </form>
    </Form>
  );
}
