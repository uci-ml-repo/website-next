"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetEditFieldButton } from "@/components/dataset/edit/DatasetEditFieldButton";
import { MDXEditor } from "@/components/editor/MDXEditor";
import { MDXViewer } from "@/components/editor/MDXViewer";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Expandable } from "@/components/ui/expandable";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/server/trpc/query/client";

const formSchema = z.object({
  description: z.string(),
});

export function DatasetDescription() {
  const {
    dataset,
    setDataset,
    startEditingField,
    stopEditingField,
    editingFields,
  } = useDataset();

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

  const pending = form.formState.isSubmitting;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1">
        <h2 className="text-2xl font-bold">About Dataset</h2>
        {!editingFields["description"] && (
          <DatasetEditFieldButton
            onClick={() => startEditingField("description")}
          />
        )}
      </div>
      {editingFields["description"] ? (
        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={() => (
                <FormItem>
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
                onClick={() => stopEditingField("description")}
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
      ) : dataset.description ? (
        <Expandable className="whitespace-pre-wrap break-words">
          <MDXViewer markdown={dataset.description} />
          {/*{dataset.description}*/}
        </Expandable>
      ) : (
        <div className="text-muted-foreground">No information</div>
      )}
    </div>
  );
}
