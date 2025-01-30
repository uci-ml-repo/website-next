import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontalIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import MDXEditor from "@/components/editor/MDXEditor";
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
import Spinner from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionCommentCreateInputProps {
  discussionId: string;
  className?: string;
  setIsCommenting: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }),
});

export default function DiscussionCommentCreateInput({
  discussionId,
  className,
  setIsCommenting,
}: DiscussionCommentCreateInputProps) {
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
    console.log("values", values);
    await createMutation.mutateAsync({
      discussionId,
      ...values,
    });
  }

  const { isDirty, isSubmitting, isSubmitSuccessful } = form.formState;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-4", className)}
        >
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
                isDirty ? setCancelDialogOpen(true) : setIsCommenting(false)
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
              Comment <SendHorizontalIcon />
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
            <Button
              variant="destructive"
              onClick={() => setIsCommenting(false)}
            >
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
