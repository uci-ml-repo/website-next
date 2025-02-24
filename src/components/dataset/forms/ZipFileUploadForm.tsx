"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ZipFileUploadFormItem } from "@/components/dataset/forms/ZipFileUploadFormItem";
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

const formSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  zipFile: z.instanceof(File, { message: "A zip file is required" }).nullable(),
});

export type FormData = z.infer<typeof formSchema>;

export function ZipFileUploadForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", zipFile: null },
  });

  const zipFile = form.watch("zipFile");

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
          render={() => <ZipFileUploadFormItem form={form} />}
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
