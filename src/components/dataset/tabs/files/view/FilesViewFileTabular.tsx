import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export function FilesViewFilesTabular({
  lines,
  delimiter,
}: {
  lines: string[];
  delimiter: string | RegExp;
}) {
  return (
    <Table>
      <TableBody>
        {lines.map((line, index) => {
          const cells = line.split(delimiter);
          return (
            <TableRow key={index}>
              <TableCell className="w-0 bg-muted">
                <pre className="text-muted-foreground">{index + 1}</pre>
              </TableCell>

              {cells.slice(0, 50).map((cell, index) => (
                <TableCell
                  key={index}
                  className={index % 2 == 1 ? "bg-muted/50" : ""}
                >
                  <pre>{cell}</pre>
                </TableCell>
              ))}
              {cells.length > 50 && (
                <TableCell className="bg-muted/50">
                  <pre>...</pre>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
