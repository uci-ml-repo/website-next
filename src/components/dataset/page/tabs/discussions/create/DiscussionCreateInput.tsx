import { zodResolver } from "@hookform/resolvers/zod";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import MDXEditor from "@/components/editor/MDXEditor";
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
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import type { DiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionCreateInputProps {
  datasetId: number;
  setIsAuthoring: React.Dispatch<React.SetStateAction<boolean>>;
  replyTo?: DiscussionResponse;
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
  setIsAuthoring,
  replyTo,
  className,
}: DiscussionCreateInputProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const utils = trpc.useUtils();

  const createMutation = trpc.discussions.create.fromData.useMutation({
    onSuccess: () => {
      utils.discussions.find.byQuery.invalidate({
        datasetId,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createMutation.mutateAsync({
      datasetId,
      title: values.title,
      content: getContent(),
    });
    form.reset();
    setIsAuthoring(false);
  }

  function getContent() {
    return editorRef.current?.getMarkdown() ?? "";
  }

  return (
    <>
      <Card className={className}>
        <CardContent>
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
                        placeholder="Discussion Topic"
                        variantSize="xl"
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
                        ref={editorRef}
                        markdown={field.value}
                        autoFocus
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
                      getContent()
                        ? setCancelDialogOpen(true)
                        : setIsAuthoring(false)
                    }
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button variant="gold" type="submit">
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
