import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Enums } from "@/db/enums";
import { enumToArray, formatEnum } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

const discussionReportReasons = enumToArray(Enums.DiscussionReportReason);

const formSchema = z.object({
  reason: z.enum(discussionReportReasons, {
    message: "Report reason is required",
  }),
  details: z.string().optional(),
});

export function DiscussionCommentReportDialog({
  discussionCommentId,
  open,
  setOpen,
}: {
  discussionCommentId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const session = useSession();

  const createReportMutation =
    trpc.discussion.comment.report.create.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: undefined,
      details: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createReportMutation.mutate({
      discussionCommentId,
      userId: session.data?.user?.id,
      ...values,
    });

    form.reset();

    setOpen(false);

    toast({
      title: "Report Submitted",
      description: "Your report has been submitted.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl">Report Comment</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {discussionReportReasons.map((reason) => (
                        <FormItem
                          key={reason}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={reason} />
                          </FormControl>
                          <FormLabel className="cursor-pointer text-lg font-normal">
                            {formatEnum(reason, false)}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="space-x-1">
                    <span>Details</span>
                    <span className="text-sm text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="max-h-[30dvh]"
                      placeholder="Provide details about the issue"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="!w-full !justify-between gap-2">
              <Button
                onClick={() => setOpen(false)}
                variant="secondary"
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gold"
                disabled={!form.watch("reason")}
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
