"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
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
import { DATASET_ROUTE } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

const formSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  // zipFile: z.instanceof(File, { message: "A zip file is required" }).nullable(),
});

export type FormData = z.infer<typeof formSchema>;

export function DatasetUploadForm() {
  // const [uploadProgress, setUploadProgress] =
  //   React.useState<AxiosProgressEvent>();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  // const zipFile = form.watch("zipFile");

  const datasetCreateMutation = trpc.dataset.create.initial.useMutation();

  // const controller = new AbortController();

  async function onSubmit(values: FormData) {
    // if (!values.zipFile) return;

    const dataset = await datasetCreateMutation.mutateAsync({
      title: values.title,
    });

    redirect(DATASET_ROUTE(dataset));

    // await axios.putForm(
    //   DATASET_ZIP_ROUTE(createdDataset),
    //   {
    //     file: values.zipFile,
    //   },
    //   {
    //     headers: { "Content-Type": "multipart/form-data" },
    //     onUploadProgress: (progressEvent) => {
    //       setUploadProgress(progressEvent);
    //     },
    //     signal: controller.signal,
    //   },
    // );
  }

  // function uploadCancel() {
  //   controller.abort();
  // }

  const pending =
    form.formState.isSubmitting || form.formState.isSubmitSuccessful;

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
                <Input
                  pill={false}
                  className="font-bold"
                  {...field}
                  disabled={pending}
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        {/*<FormField*/}
        {/*  control={form.control}*/}
        {/*  name="zipFile"*/}
        {/*  render={() => (*/}
        {/*    <ZipFileUploadFormItem*/}
        {/*      form={form}*/}
        {/*      disabled={pending}*/}
        {/*      uploadProgress={uploadProgress}*/}
        {/*      onUploadCancel={uploadCancel}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*/>*/}
        <Button
          type="submit"
          variant="gold"
          className="lift w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Spinner /> : <PlusIcon />} Create
        </Button>
      </form>
    </Form>
  );
}
