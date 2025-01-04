import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { serialize, serializeText } from "@/components/rich-text/RichText";
import RichTextEditor from "@/components/rich-text/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import type { DiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface AddDatasetDiscussionInputProps {
  datasetId: number;
  setIsAuthoring: React.Dispatch<React.SetStateAction<boolean>>;
  replyTo?: DiscussionResponse;
}

const formSchema = z.object({
  nodes: z.array(z.any()),
});

export default function DiscussionCreateInput({
  datasetId,
  setIsAuthoring,
  replyTo,
}: AddDatasetDiscussionInputProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nodes: [{ type: "paragraph", children: [{ text: "" }] }],
    },
  });

  const isTextEmpty = serializeText(form.watch("nodes")).length === 0;

  const utils = trpc.useUtils();

  const createMutation = trpc.discussions.create.fromData.useMutation({
    onSuccess: () => {
      utils.discussions.find.byQuery.invalidate({
        datasetId,
        orderBy: "upvoteCount",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createMutation.mutateAsync({
      datasetId,
      content: serialize(values.nodes),
      replyToId: replyTo?.id,
    });
    form.reset();
    setIsAuthoring(false);
  }

  return (
    <>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nodes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor
                        {...field}
                        disallowedFormats={["heading-one", "heading-two"]}
                        spellCheck
                        placeholder="Write a comment..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                {replyTo ? (
                  <div className="text-sm text-muted-foreground">
                    Replying to {replyTo.user.name}
                  </div>
                ) : (
                  <div />
                )}
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      isTextEmpty
                        ? setIsAuthoring(false)
                        : setCancelDialogOpen(true)
                    }
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gold"
                    type="submit"
                    disabled={isTextEmpty || createMutation.isPending}
                  >
                    {createMutation.isPending && <Spinner />}
                    Post
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
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
              onClick={() => {
                form.reset();
                setCancelDialogOpen(false);
                setIsAuthoring(false);
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
