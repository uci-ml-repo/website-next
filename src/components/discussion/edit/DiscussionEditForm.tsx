"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { formSchema } from "@/components/discussion/create/DiscussionCreateForm";
import { DiscussionDeleteDialog } from "@/components/discussion/view/extended/DiscussionDeleteDialog";
import { MDXEditor } from "@/components/editor/MDXEditor";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
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

export function DiscussionEditForm({
  discussion,
}: {
  discussion: DiscussionResponse;
}) {
  const router = useRouter();

  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const ref = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: discussion.title,
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
    const markdown = ref.current?.getMarkdown();

    if (!markdown || !markdown.trim()) {
      form.setError("content", {
        message: "Content is required",
      });
      return;
    }

    editMutation.mutate({
      id: discussion.id,
      title: values.title,
      content: markdown,
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
            render={() => (
              <FormItem>
                <FormControl>
                  <MDXEditor
                    ref={ref}
                    markdown={discussion.content}
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
          <p>You have an edit in progress, discard it without saving?</p>
          <div className="flex justify-between">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
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
