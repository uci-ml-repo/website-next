import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import ProfileAvatar from "@/components/ui/profile-avatar";
import Spinner from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionCommentCreateInputProps {
  discussionId: string;
  setIsCommenting: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}

export const formSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }),
});

export default function DiscussionCommentCreateInput({
  discussionId,
  setIsCommenting,
  setOrderBy,
}: DiscussionCommentCreateInputProps) {
  const { data: session } = useSession();

  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const utils = trpc.useUtils();

  const createMutation = trpc.discussion.comment.create.fromData.useMutation({
    onSuccess: async () => {
      await utils.discussion.comment.find.byQuery.invalidate({
        discussionId,
      });

      setIsCommenting(false);
      setOrderBy("new");
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
      discussionId,
      ...values,
    });

    form.reset();
  }

  const { isDirty, isSubmitting } = form.formState;

  return (
    <>
      <div className="flex w-full py-4">
        <ProfileAvatar
          src={session?.user.image}
          className="mr-3 size-10 max-sm:hidden"
        />
        <div className="w-full">
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
                        placeholder="Add comment"
                        disabled={isSubmitting}
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
                    isDirty ? setCancelDialogOpen(true) : setIsCommenting(false)
                  }
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="gold"
                  type="submit"
                  disabled={!isDirty || isSubmitting}
                >
                  {isSubmitting && <Spinner />}
                  Comment
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Discard comment?</DialogTitle>
          <p>You have a comment in progress, discard it?</p>
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() => setCancelDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                form.reset();
                setIsCommenting(false);
                setCancelDialogOpen(false);
              }}
            >
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
