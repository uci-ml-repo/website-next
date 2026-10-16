"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateDatasetDraft } from "@/server/types/dataset/donation";

export function DatasetDraftBasics() {
  const { control } = useFormContext<CreateDatasetDraft>();

  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dataset title (required)</FormLabel>
            <FormControl>
              <Input {...field} maxLength={255} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (required)</FormLabel>
            <FormControl>
              <Textarea {...field} maxLength={10_000} rows={5} />
            </FormControl>
            <FormDescription>
              Describe the data, how it was collected, and what it can be used for.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
