"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DatasetDraftBasics } from "@/components/dataset/donation/dataset-draft-basics";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ROUTES } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";
import { type CreateDatasetDraft, createDatasetDraft } from "@/server/types/dataset/donation";

export function DatasetDraftCreate() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const form = useForm<CreateDatasetDraft>({
    resolver: zodResolver(createDatasetDraft),
    defaultValues: { title: "", description: "" },
  });
  const create = trpc.dataset.donation.create.useMutation({
    onSuccess: (dataset) => {
      void utils.dataset.find.byUserId.invalidate();
      toast.success("Draft created");
      router.push(ROUTES.DATASET.SETTINGS(dataset));
    },
  });

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((fields) => create.mutate(fields))}
            className="space-y-6"
          >
            {create.error && (
              <Alert variant="destructive" role="alert">
                <AlertCircleIcon />
                <AlertDescription>{create.error.message}</AlertDescription>
              </Alert>
            )}
            <fieldset disabled={create.isPending} className="space-y-6">
              <DatasetDraftBasics />
              <Button type="submit" variant="gold" disabled={create.isPending}>
                {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
                {create.isPending ? "Creating draft…" : "Create draft"}
              </Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
