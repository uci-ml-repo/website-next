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
  FormLabel,
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

export default function AddDatasetDiscussionInput({
  dataset,
  setIsAuthoring,
}: AddDatasetDiscussionInputProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    trpc.discussions.create.fromData.useMutation().mutate({
      datasetId: dataset.id,
      text: values.text,
    });
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
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[100px]" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    !!form.watch("text")
                      ? setCancelDialogOpen(true)
                      : setIsAuthoring(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="gold"
                  type="submit"
                  disabled={!!form.watch("text")}
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogTitle>Discard comment?</DialogTitle>
        </DialogContent>
      </Dialog>
    </>
  );
}
