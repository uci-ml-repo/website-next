import { Expandable } from "@/components/ui/expandable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DatasetVariables({ dataset }: { dataset: DatasetResponse }) {
  return (
    <Expandable className="space-y-2" truncationHeight={300}>
      <h2 className="text-2xl font-bold">Variables</h2>
      {!dataset.variablesDescription && !dataset.variables.length && (
        <div className="text-muted-foreground">No information</div>
      )}
      {dataset.variablesDescription && (
        <div className="break-words">{dataset.variablesDescription}</div>
      )}
      {dataset.variables.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="max-md:hidden">Description</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Missing Values</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataset.variables.map((variable, index) => (
              <TableRow
                key={variable.id}
                className={cn({ "bg-muted/70": index % 2 == 0 })}
              >
                <TableCell className="font-bold">{variable.name}</TableCell>
                <TableCell>{variable.role}</TableCell>
                <TableCell>{variable.type}</TableCell>
                <TableCell className="max-md:hidden">
                  {variable.description ?? "-"}
                </TableCell>
                <TableCell>{variable.units ?? "-"}</TableCell>
                <TableCell>{variable.missingValues ? "yes" : "no"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Expandable>
  );
}
