import { zodResolver } from "@hookform/resolvers/zod";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { MDXEditor } from "@/components/editor/MDXEditor";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/server/trpc/query/client";

const formSchema = z.object({
  description: z.string(),
});

export function DatasetDescriptionForm() {
  const { dataset, setDataset, stopEditingField } = useDataset();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  const ref = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: dataset.description ?? "",
    },
  });

  const editMutation = trpc.edit.create.editFields.useMutation({
    onSuccess: () => {
      setDataset({
        ...dataset,
        description: ref.current?.getMarkdown() ?? null,
      });
      stopEditingField("description");
    },
    onError: (error) => {
      toast({
        title: "Error editing dataset description",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit() {
    const description = ref.current?.getMarkdown() ?? null;

    if (!description || description.trim().length === 0) {
      return form.setError("description", {
        message: "Description is required",
      });
    }

    editMutation.mutate({
      datasetId: dataset.id,
      editFields: {
        description,
      },
    });
  }

  const pending = editMutation.isPending;

  return (
    <>
      <Form {...form}>
        <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="description"
            render={() => (
              <FormItem>
                <FormLabel className="sr-only">About Dataset</FormLabel>
                <FormControl>
                  <MDXEditor
                    ref={ref}
                    disabled={pending}
                    markdown={dataset.description ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end space-x-2">
            <Button
              onClick={() => {
                if (dataset.description === ref.current?.getMarkdown()) {
                  stopEditingField("description");
                } else {
                  setConfirmDialogOpen(true);
                }
              }}
              disabled={pending}
              variant="secondary"
              className="lift"
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" className="lift" disabled={pending}>
              {pending && <Spinner />} Save
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogTitle>Discard description edit?</DialogTitle>
          <div>
            You have unsaved changes to the dataset description, discard them
            without saving?
          </div>
          <div className="flex justify-between">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => stopEditingField("description")}
            >
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
