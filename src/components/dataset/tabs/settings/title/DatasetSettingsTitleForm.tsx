"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import type { FormData } from "@/components/dataset/create/DatasetDonationCreateForm";
import { formSchema } from "@/components/dataset/create/DatasetDonationCreateForm";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { DATASET_SETTINGS_ROUTE } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

interface DatasetSettingsTitleFormProps {
  setEditingTitle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DatasetSettingsTitleForm({
  setEditingTitle,
}: DatasetSettingsTitleFormProps) {
  const { dataset, setDataset } = useDataset();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: dataset.title },
  });

  const datasetTitleMutation = trpc.dataset.update.title.useMutation({
    onSuccess: (newDataset) => {
      window.history.replaceState(null, "", DATASET_SETTINGS_ROUTE(newDataset));
      setDataset({ ...dataset, title: newDataset.title });
      setEditingTitle(false);
    },

    onError: (error) =>
      toast({
        variant: "destructive",
        title: "Error editing dataset title",
        description: error.message,
      }),
  });

  async function onSubmit(values: FormData) {
    await datasetTitleMutation.mutateAsync({
      datasetId: dataset.id,
      title: values.title,
      isExternal: !!dataset.externalLink,
    });
  }

  const pending = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <div className="flex space-x-2">
                <div className="w-full">
                  <FormControl>
                    <Input
                      className="font-bold"
                      {...field}
                      disabled={pending}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <div>
                      <FormMessage className="text-sm" />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {field.value.length}/100
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="lift"
                  disabled={pending}
                  onClick={() => setEditingTitle(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="lift"
                  disabled={pending}
                >
                  {pending && <Spinner />}Save
                </Button>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
