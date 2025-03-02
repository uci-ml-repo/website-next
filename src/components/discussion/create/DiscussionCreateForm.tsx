"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontalIcon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MDXEditor } from "@/components/editor/MDXEditor";
import { toast } from "@/components/hooks/use-toast";
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
import { Spinner } from "@/components/ui/spinner";
import {
  DATASET_DISCUSSION_ROUTE,
  DATASET_DISCUSSIONS_ROUTE,
} from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionCreateFormProps {
  datasetId: number;
  datasetSlug: string;
}

export const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(150, { message: "Title must be less than 150 characters" }),
  content: z.string().min(1, { message: "Content is required" }),
});

export function DiscussionCreateForm({
  datasetId,
  datasetSlug,
}: DiscussionCreateFormProps) {
  const router = useRouter();
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
    onSuccess: async (data) => {
      await utils.discussion.find.countByQuery.invalidate({
        datasetId,
      });

      router.push(
        DATASET_DISCUSSION_ROUTE({
          id: datasetId,
          slug: datasetSlug,
          discussionId: data.id,
        }),
      );
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createMutation.mutateAsync({
      datasetId,
      ...values,
    });
  }

  const { isDirty, isSubmitting, isSubmitSuccessful } = form.formState;

  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold">Start Discussion</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="rounded-lg bg-secondary">
                    <div className="px-2 py-1 text-sm">Discussion Title</div>
                    <Input
                      {...field}
                      pill={false}
                      className="bg-background px-4 font-bold"
                      variantSize="xl"
                      disabled={isSubmitting || isSubmitSuccessful}
                    />
                  </div>
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
                    disabled={isSubmitting || isSubmitSuccessful}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              disabled={isSubmitting || isSubmitSuccessful}
              onClick={() =>
                isDirty
                  ? setCancelDialogOpen(true)
                  : redirect(
                      DATASET_DISCUSSIONS_ROUTE({
                        id: datasetId,
                        slug: datasetSlug,
                      }),
                    )
              }
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              type="submit"
              disabled={isSubmitting || isSubmitSuccessful}
            >
              {(isSubmitting || isSubmitSuccessful) && <Spinner />}
              Post <SendHorizontalIcon />
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Discard discussion?</DialogTitle>
          <p>You have a discussion in progress, discard it?</p>
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={() => setCancelDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                redirect(
                  DATASET_DISCUSSIONS_ROUTE({
                    id: datasetId,
                    slug: datasetSlug,
                  }),
                )
              }
            >
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
