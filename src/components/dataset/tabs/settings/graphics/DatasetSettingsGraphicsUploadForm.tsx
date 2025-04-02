import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosProgressEvent } from "axios";
import axios from "axios";
import { ImageIcon, UploadIcon } from "lucide-react";
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
  DATASET_API_THUMBNAIL_PENDING_ROUTE,
  DATASET_API_THUMBNAIL_ROUTE,
} from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export function DatasetSettingsGraphicsUploadForm({
  onUpload,
}: {
  onUpload: () => void;
}) {
  const { dataset } = useDataset();
  const { setHasPendingThumbnail } = useDatasetFileStatus();

  const requireApproval = dataset.status !== Enums.ApprovalStatus.DRAFT;

  const [uploadProgress, setUploadProgress] = useState<AxiosProgressEvent>();
  const controllerRef = useRef<AbortController | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  });

  const hasGraphicsMutation = trpc.dataset.update.hasGraphics.useMutation({
    onError: (error) =>
      toast({
        variant: "destructive",
        title: "Error uploading thumbnail",
        description: error.message,
      }),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.file) return;

    controllerRef.current = new AbortController();

    try {
      await axios.putForm(
        requireApproval
          ? DATASET_API_THUMBNAIL_PENDING_ROUTE({ ...dataset, fallback: false })
          : DATASET_API_THUMBNAIL_ROUTE({ ...dataset, fallback: false }),
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
        title: "Error uploading thumbnail",
        description: (error as Error).message,
      });
      return;
    }

    if (requireApproval) {
      setHasPendingThumbnail(true);
    } else {
      hasGraphicsMutation.mutate({
        datasetId: dataset.id,
        hasGraphics: true,
      });
    }

    onUpload();
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
        <FileUploadFormItem
          form={form}
          pending={pending}
          uploadProgress={uploadProgress}
          cancelUpload={cancelUpload}
          fileIcon={<ImageIcon />}
          accept={{
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
          }}
        />
        <Button
          type="submit"
          className="lift w-full"
          variant="gold"
          disabled={pending}
        >
          {pending ? <Spinner /> : <UploadIcon />} Upload thumbnail
        </Button>
      </form>
    </Form>
  );
}
