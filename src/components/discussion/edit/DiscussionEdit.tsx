"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { formSchema } from "@/components/discussion/create/DiscussionCreateForm";
import { DiscussionDeleteDialog } from "@/components/discussion/view/extended/DiscussionDeleteDialog";
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
import { DATASET_DISCUSSION_ROUTE } from "@/lib/routes";
import type { DiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

export function DiscussionEdit({
  discussion,
}: {
  discussion: DiscussionResponse;
}) {
  const router = useRouter();

  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: discussion.title,
      content: discussion.content,
    },
  });

  const redirectRoute = DATASET_DISCUSSION_ROUTE({
    id: discussion.dataset.id,
    slug: discussion.dataset.slug,
    discussionId: discussion.id,
  });

  const editMutation = trpc.discussion.update.byId.useMutation({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push(redirectRoute);
    },
  });

  const { isDirty, isSubmitting, isSubmitSuccessful } = form.formState;

  function onSubmit(values: z.infer<typeof formSchema>) {
    editMutation.mutate({
      id: discussion.id,
      ...values,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <div className="truncate text-2xl font-bold">
          Edit: {discussion.title}
        </div>
        <Button
          variant="ghost-destructive"
          size="icon"
          onClick={() => setDeleteDialogOpen(true)}
          className="shrink-0"
        >
          <Trash2Icon />
        </Button>
      </div>
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
              onClick={() =>
                isDirty ? setCancelDialogOpen(true) : redirect(redirectRoute)
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
              Submit <PencilIcon />
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Discard edits?</DialogTitle>
          <p>You have an edit in progress, discard it?</p>
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={() => setCancelDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => redirect(redirectRoute)}
            >
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DiscussionDeleteDialog
        discussion={discussion}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </div>
  );
}
