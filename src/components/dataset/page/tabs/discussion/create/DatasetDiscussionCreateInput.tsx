import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import type { DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface AddDatasetDiscussionInputProps {
  dataset: DatasetResponse;
  setIsAuthoring: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
  text: z.string().min(1, { message: "Comment is required" }).max(9999, {
    message: "Comment must be less than 10,000 characters",
  }),
});

export default function DatasetDiscussionCreateInput({
  dataset,
  setIsAuthoring,
}: AddDatasetDiscussionInputProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const createMutation = trpc.discussions.create.fromData.useMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMutation.mutate({
      datasetId: dataset.id,
      text: values.text,
    });

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
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    form.watch("text")
                      ? setCancelDialogOpen(true)
                      : setIsAuthoring(false)
                  }
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="gold"
                  type="submit"
                  disabled={!form.watch("text")}
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Discard comment?</DialogTitle>
          <p>
            You have a comment in progress, are you sure you want to discard it?
          </p>
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
                form.reset({ text: "" });
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
