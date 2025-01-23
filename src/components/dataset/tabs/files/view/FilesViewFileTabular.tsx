import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function FilesViewFilesTabular({
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

              {cells.map((cell, index) => (
                <TableCell
                  key={index}
                  className={index % 2 == 1 ? "bg-muted/50" : ""}
                >
                  <pre>{cell}</pre>
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
