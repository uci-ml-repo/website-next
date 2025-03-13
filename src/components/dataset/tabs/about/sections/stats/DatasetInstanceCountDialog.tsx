import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetEditFieldButton } from "@/components/dataset/edit/DatasetEditFieldButton";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/server/trpc/query/client";

const formSchema = z.object({
  instanceCount: z.number().int().nonnegative(),
});

export function DatasetInstanceCountDialog() {
  const { dataset, setDataset, editingFields, stopEditingField } = useDataset();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instanceCount: dataset.instanceCount ?? undefined,
    },
  });

  const editMutation = trpc.edit.create.editFields.useMutation({
    onSuccess: (editedDataset) => {
      setDataset({ ...dataset, instanceCount: editedDataset.instanceCount });
      stopEditingField("instanceCount");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error editing dataset instance count",
        description: error.message,
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    editMutation.mutate({
      datasetId: dataset.id,
      editFields: {
        instanceCount: values.instanceCount,
      },
    });
  }

  const pending = editMutation.isPending;

  return (
    <>
      <DatasetEditFieldButton field="instanceCount" />
      <Dialog
        open={editingFields["instanceCount"]}
        onOpenChange={(open) => {
          if (!open) stopEditingField("instanceCount");
        }}
      >
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="instanceCount"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>
                      <DialogTitle>Edit dataset instance count</DialogTitle>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="!w-full !justify-between gap-2">
                <DialogClose asChild>
                  <Button variant="secondary" type="button" disabled={pending}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  variant="gold"
                  disabled={pending || !form.watch("instanceCount")}
                >
                  {pending && <Spinner />} Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
