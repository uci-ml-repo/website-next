import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import { Enums } from "@/db/lib/enums";
import { CONTACT_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { enumToArray, formatEnum } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

const datasetReportReasons = enumToArray(Enums.DatasetReportReason);

const formSchema = z.object({
  reason: z.enum(datasetReportReasons, {
    message: "Report reason is required",
  }),
  details: z.string().min(1, { message: "Details are required" }),
});

export function DatasetReportDialog({
  dataset,
  open,
  setOpen,
}: {
  dataset: DatasetResponse;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const session = useSession();

  const createReportMutation = trpc.report.dataset.create.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: undefined,
      details: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createReportMutation.mutate({
      datasetId: dataset.id,
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
      <DialogContent aria-describedby={undefined}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Report Dataset Issue
              </DialogTitle>
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
                      {datasetReportReasons.map((reason) => (
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

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="after:text-destructive after:content-['*']">
                        Details
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

              <div className="text-sm text-muted-foreground">
                For urgent requests, please{" "}
                <Link href={CONTACT_ROUTE} className="underline">
                  contact us directly
                </Link>
                .
              </div>
            </div>

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
                disabled={!(form.watch("reason") && form.watch("details"))}
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
