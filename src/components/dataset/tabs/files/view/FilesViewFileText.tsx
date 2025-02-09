export function FilesViewFileText({ lines }: { lines: string[] }) {
  return (
    <div className="flex space-x-2 *:space-y-0.5">
      <div className="border-r bg-muted px-1 text-sm text-muted-foreground">
        {lines.map((_, index) => (
          <pre key={index}>{index + 1}</pre>
        ))}
      </div>
      <div className="whitespace-pre-wrap text-sm">
        {lines.map((line, index) => (
          <pre key={index}>{line}</pre>
        ))}
      </div>
    </div>
  );
}
