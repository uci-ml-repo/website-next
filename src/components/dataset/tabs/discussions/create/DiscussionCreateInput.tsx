"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontalIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import MDXEditor from "@/components/editor/MDXEditor";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionCreateInputProps {
  datasetId: number;
  className?: string;
}

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  content: z.string().min(1, { message: "Content is required" }),
});

export default function DiscussionCreateInput({
  datasetId,
}: DiscussionCreateInputProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const utils = trpc.useUtils();

  const createMutation = trpc.discussion.create.fromData.useMutation({
    onSuccess: () => {
      utils.discussion.find.byQuery.invalidate({
        datasetId,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createMutation.mutateAsync({
      datasetId,
      ...values,
    });
    redirect(".");
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    pill={false}
                    className="px-4 font-bold"
                    placeholder="Discussion Title"
                    variantSize="xl"
                    disabled={
                      form.formState.isSubmitting || form.formState.isSubmitted
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MDXEditor
                    {...field}
                    markdown={field.value}
                    autoFocus
                    readOnly={
                      form.formState.isSubmitting || form.formState.isSubmitted
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() =>
                form.getValues().content || form.getValues().title
                  ? setCancelDialogOpen(true)
                  : redirect(".")
              }
              type="button"
            >
              Cancel
            </Button>
            <Button variant="gold" type="submit">
              {(form.formState.isSubmitting || form.formState.isSubmitted) && (
                <Spinner />
              )}
              Post <SendHorizontalIcon />
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Discard comment?</DialogTitle>
          <p>You have a comment in progress, discard it?</p>
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={() => setCancelDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => redirect(".")}>
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
