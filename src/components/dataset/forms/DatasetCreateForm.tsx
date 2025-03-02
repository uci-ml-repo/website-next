"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { trpc } from "@/server/trpc/query/client";

const formSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
});

export type FormData = z.infer<typeof formSchema>;

export function DatasetCreateForm() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
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
    await datasetCreateMutation.mutateAsync({
      title: values.title,
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
              <FormLabel className="text-lg">Dataset Title</FormLabel>
              <FormControl>
                <Input className="font-bold" {...field} disabled={pending} />
              </FormControl>
              <FormMessage className="text-sm" />
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
