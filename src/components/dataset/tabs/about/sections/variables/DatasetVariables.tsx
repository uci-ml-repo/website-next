import { useDataset } from "@/components/dataset/context/DatasetContext";
import { Copy } from "@/components/ui/copy";
import { Expandable } from "@/components/ui/expandable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { VariableSelect } from "@/db/lib/types";
import { cn } from "@/lib/utils";

/**
 * @example
 * ```
 * name,role,type,description,units,missingvalues
 * sepal length,feature,continuous,,cm,no
 * ```
 */
function variablesToCsv(variables: VariableSelect[]): string {
  const header = ["name", "role", "type", "description", "units", "missingvalues"];

  function escapeCell(cell: string): string {
    if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
      return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
  }

  const rows = variables.map((variable) => {
    const row = [
      variable.name,
      variable.role,
      variable.type,
      variable.description ?? "",
      variable.units ?? "",
      variable.missingValues ? "yes" : "no",
    ];
    return row.map(escapeCell).join(",");
  });

  return [header.join(","), ...rows].join("\n");
}

export function DatasetVariables() {
  const { dataset } = useDataset();

  const variablesCsv = variablesToCsv(dataset.variables);

  return (
    <div>
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold">Variables</h2>
        {dataset.variables.length > 0 && (
          <Copy
            copyText={variablesCsv}
            absolute={false}
            className={cn("px-2 py-1")}
            tooltip="Copy variables as CSV"
          >
            CSV
          </Copy>
        )}
      </div>

      <Expandable className="space-y-2" truncationHeight={300}>
        {dataset.variables.length > 0 ? (
          <Table className="overflow-x-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="max-md:hidden">Description</TableHead>
                <TableHead>Units</TableHead>
                <TableHead className="text-nowrap">Missing Values</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataset.variables.map((variable, index) => (
                <TableRow key={variable.id} className={cn({ "bg-muted/70": index % 2 == 0 })}>
                  <TableCell className="font-bold">{variable.name}</TableCell>
                  <TableCell>{variable.role}</TableCell>
                  <TableCell>{variable.type}</TableCell>
                  <TableCell className="max-md:hidden">{variable.description ?? "-"}</TableCell>
                  <TableCell>{variable.units ?? "-"}</TableCell>
                  <TableCell>{variable.missingValues ? "yes" : "no"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-muted-foreground">No information</div>
        )}
      </Expandable>
    </div>
  );
}
