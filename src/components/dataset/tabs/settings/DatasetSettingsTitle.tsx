"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

import type { FormData } from "@/components/dataset/forms/DatasetDonationCreateForm";
import { formSchema } from "@/components/dataset/forms/DatasetDonationCreateForm";
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
import type { DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

export function DatasetSettingsTitle({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const datasetTitleMutation = trpc.dataset.update.title.useMutation({});

  async function onSubmit(values: FormData) {
    await datasetTitleMutation.mutateAsync({
      datasetId: dataset.id,
      title: values.title,
      isExternal: !!dataset.externalLink,
    });
  }

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
              <FormLabel className="text-lg font-bold">Dataset Title</FormLabel>
              <FormControl>
                <Input className="font-bold" {...field} disabled={pending} />
              </FormControl>
              <div className="flex justify-between">
                <div>
                  <FormMessage className="text-sm" />
                </div>

                <div className="text-sm text-muted-foreground">
                  {field.value.length}/100
                </div>
              </div>{" "}
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="gold"
          className="lift w-full"
          disabled={pending}
        >
          {pending ? <Spinner /> : <PlusIcon />} Create Dataset
        </Button>
      </form>
    </Form>
  );
}
