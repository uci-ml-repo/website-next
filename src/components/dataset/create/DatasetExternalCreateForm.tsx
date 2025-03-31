"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { formSchema } from "@/components/dataset/create/DatasetDonationCreateForm";
import { toast } from "@/components/hooks/use-toast";
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
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

const externalFormSchema = formSchema.extend({
  externalLink: z
    .string({ message: "External URL is required" })
    .url({ message: "External URL must be a valid URL" })
    .refine((value) => value.startsWith("https://"), {
      message: "External URL must start with https://",
    }),
});

export type FormData = z.infer<typeof externalFormSchema>;

export function DatasetExternalCreateForm() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(externalFormSchema),
    defaultValues: { title: "", externalLink: "" },
  });

  const datasetCreateMutation = trpc.dataset.create.draft.useMutation({
    onSuccess: async (dataset) => {
      router.push(DATASET_ROUTE(dataset));
      toast({
        title: "Dataset draft created successfully",
        description: "You can view your datasets on your profile",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error creating dataset",
        description: error.message,
      });
    },
  });

  async function onSubmit(values: FormData) {
    await datasetCreateMutation.mutateAsync(values);
  }

  const pending = form.formState.isSubmitting || form.formState.isSubmitSuccessful;

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
                <Input className="font-bold" {...field} disabled={pending} />
              </FormControl>
              <div className="flex justify-between">
                <div>
                  <FormMessage className="text-sm" />
                </div>

                <div
                  className={cn("text-xs text-muted-foreground", {
                    "text-destructive": field.value.length > 100,
                  })}
                >
                  {field.value.length}/100
                </div>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="externalLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">External URL</FormLabel>
              <FormControl>
                <Input className="font-bold" {...field} disabled={pending} />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <Button type="submit" variant="gold" className="lift w-full" disabled={pending}>
          {pending ? <Spinner /> : <PlusIcon />} Create Dataset
        </Button>
      </form>
    </Form>
  );
}
