"use client";

import type { DatasetSelect } from "@packages/db/types";
import { AlertCircleIcon, CheckCircle2Icon, Loader2Icon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { abbreviateFileSize } from "@/lib/util/abbreviate";
import { trpc } from "@/server/trpc/query/client";
import { datasetArchiveUpload } from "@/server/types/dataset/donation";

export function DatasetArchiveUpload({
  dataset,
  onUploaded,
  onPendingChange,
  onFileChange,
}: {
  dataset: DatasetSelect;
  onUploaded: (dataset: DatasetSelect) => void;
  onPendingChange: (pending: boolean) => void;
  onFileChange: (selected: boolean) => void;
}) {
  const [file, setFile] = useState<File>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const input = useRef<HTMLInputElement>(null);
  const start = trpc.file.upload.start.useMutation();
  const complete = trpc.file.upload.complete.useMutation();

  async function upload() {
    if (!file || pending) return;
    setError(undefined);
    const parsed = datasetArchiveUpload.safeParse({
      datasetId: dataset.id,
      name: file.name,
      size: file.size,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setPending(true);
    onPendingChange(true);
    try {
      const { key, url } = await start.mutateAsync(parsed.data);
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/zip" },
        body: file,
      });
      if (!response.ok) throw new Error("Upload failed. Please try again.");
      const updated = await complete.mutateAsync({ datasetId: dataset.id, key });
      onUploaded(updated);
      setFile(undefined);
      onFileChange(false);
      if (input.current) input.current.value = "";
      toast.success("Dataset archive uploaded");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to upload the dataset archive");
    } finally {
      setPending(false);
      onPendingChange(false);
    }
  }

  return (
    <div className="space-y-3">
      {dataset.archiveKey && (
        <p className="flex items-center gap-2 text-sm">
          <CheckCircle2Icon className="size-4" />
          Archive saved · {dataset.fileCount} files · {abbreviateFileSize(dataset.size ?? 0)}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="dataset-archive">Dataset ZIP archive</Label>
        <Input
          ref={input}
          id="dataset-archive"
          type="file"
          accept=".zip,application/zip"
          disabled={pending}
          onChange={(event) => {
            setFile(event.target.files?.[0]);
            onFileChange(Boolean(event.target.files?.length));
            setError(undefined);
          }}
          aria-describedby="dataset-archive-help"
        />
        <p id="dataset-archive-help" className="text-muted-foreground text-sm">
          Upload a ZIP archive up to 100 MB. Files stay private during drafting and review.
          Uploading an archive replaces the external dataset URL.
        </p>
      </div>
      {error && (
        <Alert variant="destructive" role="alert">
          <AlertCircleIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button
        type="button"
        variant="outline"
        disabled={!file || pending}
        onClick={() => void upload()}
      >
        {pending ? <Loader2Icon className="animate-spin" /> : <UploadIcon />}
        {pending
          ? "Uploading and validating…"
          : dataset.archiveKey
            ? "Replace archive"
            : "Upload archive"}
      </Button>
    </div>
  );
}
