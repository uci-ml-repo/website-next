import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { DiscussionCommentResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

import { formSchema } from "../create/DiscussionCommentCreateInput";

export function DiscussionCommentEdit({
  discussionComment,
  setIsEditing,
}: {
  discussionComment: DiscussionCommentResponse;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: discussionComment.content,
    },
  });

  const utils = trpc.useUtils();

  const editMutation = trpc.discussion.comment.update.byId.useMutation({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      await utils.discussion.comment.find.byQuery.invalidate({
        discussionId: discussionComment.discussionId,
      });
      setIsEditing(false);
    },
  });

  const { isDirty, isSubmitting, isSubmitSuccessful } = form.formState;

  function onSubmit(values: z.infer<typeof formSchema>) {
    editMutation.mutate({
      id: discussionComment.id,
      ...values,
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    className="bg-background"
                    disabled={isSubmitting || isSubmitSuccessful}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() =>
                isDirty ? setCancelDialogOpen(true) : setIsEditing(false)
              }
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              type="submit"
              disabled={!isDirty || isSubmitting || isSubmitSuccessful}
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
            <Button variant="destructive" onClick={() => setIsEditing(false)}>
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
