import type { DatasetResponse } from "@/lib/types";

export function DatasetVariables({ dataset }: { dataset: DatasetResponse }) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Variables</h2>
      <div className="break-words">{dataset.variablesDescription}</div>
    </div>
  );
}
