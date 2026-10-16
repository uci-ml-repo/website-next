"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { DatasetSelect } from "@packages/db/types";
import { AlertCircleIcon, Loader2Icon, SaveIcon, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DatasetArchiveUpload } from "@/components/dataset/donation/dataset-archive-upload";
import { DatasetDraftBasics } from "@/components/dataset/donation/dataset-draft-basics";
import { DatasetDraftDetails } from "@/components/dataset/donation/dataset-draft-fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/server/trpc/query/client";
import {
  type DatasetDraftFields,
  datasetDraftFields,
  datasetReviewFields,
} from "@/server/types/dataset/donation";

function draftValues(dataset: DatasetSelect): DatasetDraftFields {
  return {
    title: dataset.title,
    description: dataset.description,
    yearCreated: dataset.yearCreated,
    subjectArea: dataset.subjectArea,
    instanceCount: dataset.instanceCount,
    featureCount: dataset.featureCount,
    citation: dataset.citation,
    externalLink: dataset.externalLink,
    dataTypes: dataset.dataTypes,
    tasks: dataset.tasks,
    featureTypes: dataset.featureTypes,
  };
}

export function DatasetDraftEditor({ dataset }: { dataset: DatasetSelect }) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [current, setCurrent] = useState(dataset);
  const [uploading, setUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [error, setError] = useState<string>();
  const form = useForm<DatasetDraftFields>({
    resolver: zodResolver(datasetDraftFields),
    defaultValues: draftValues(dataset),
  });
  const save = trpc.dataset.donation.save.useMutation();
  const submit = trpc.dataset.donation.submit.useMutation();
  const pending = save.isPending || submit.isPending || uploading;

  function onSaved(updated: DatasetSelect) {
    setCurrent(updated);
    form.reset(draftValues(updated));
    void utils.dataset.find.invalidate();
    router.refresh();
  }

  async function saveDraft(fields: DatasetDraftFields) {
    if (pending) return;
    setError(undefined);
    try {
      const updated = await save.mutateAsync({ datasetId: dataset.id, fields });
      onSaved(updated);
      toast.success("Draft saved");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save draft");
    }
  }

  async function submitForReview(fields: DatasetDraftFields) {
    if (pending) return;
    setError(undefined);
    if (fileSelected) {
      setError("Upload the selected ZIP archive before submitting for review.");
      return;
    }
    const result = datasetReviewFields.safeParse(fields);
    if (!result.success) {
      for (const issue of result.error.issues) {
        form.setError(issue.path[0] as keyof DatasetDraftFields, { message: issue.message });
      }
      form.setFocus(result.error.issues[0].path[0] as keyof DatasetDraftFields);
      setError(
        "Complete the fields required for review. You can save an incomplete draft at any time.",
      );
      return;
    }
    if (!fields.externalLink && (!current.fileCount || !current.size)) {
      setError("Upload a dataset ZIP archive or provide an external dataset URL before review.");
      return;
    }

    try {
      const updated = await submit.mutateAsync({ datasetId: dataset.id, fields: result.data });
      onSaved(updated);
      toast.success("Dataset submitted for review");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to submit dataset");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(saveDraft)} className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">Edit dataset draft</h2>
          <Badge variant="secondary">Draft</Badge>
        </div>
        <p className="text-muted-foreground">
          Save your progress and return from My datasets. Your draft stays private until it is
          approved.
        </p>
        {error && (
          <Alert variant="destructive" role="alert">
            <AlertCircleIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <fieldset disabled={pending} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dataset information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <DatasetDraftBasics />
              <DatasetDraftDetails />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Dataset files</CardTitle>
              <CardDescription>
                Upload your data, or link to a dataset hosted elsewhere.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <DatasetArchiveUpload
                dataset={current}
                onPendingChange={setUploading}
                onFileChange={setFileSelected}
                onUploaded={(updated) => {
                  setCurrent(updated);
                  form.setValue("externalLink", null, { shouldDirty: true, shouldValidate: true });
                  void utils.dataset.find.invalidate();
                  router.refresh();
                }}
              />
              <FormField
                control={form.control}
                name="externalLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External dataset URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value.trim() || null)}
                        type="url"
                        maxLength={2048}
                        placeholder="https://example.org/dataset"
                      />
                    </FormControl>
                    <FormDescription>
                      For data hosted elsewhere, enter an HTTP or HTTPS URL. Saving a URL replaces
                      the uploaded archive.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Submit for review</CardTitle>
              <CardDescription>
                Complete the subject area, year, and instance count, and provide your data.
                Submission saves your edits and locks the dataset while our team reviews it.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button type="submit" variant="outline" disabled={pending}>
                {save.isPending ? <Loader2Icon className="animate-spin" /> : <SaveIcon />}Save draft
              </Button>
              <Button
                type="button"
                variant="gold"
                disabled={pending}
                onClick={() => void form.handleSubmit(submitForReview)()}
              >
                {submit.isPending ? <Loader2Icon className="animate-spin" /> : <SendIcon />}Submit
                for review
              </Button>
            </CardContent>
          </Card>
        </fieldset>
      </form>
    </Form>
  );
}
