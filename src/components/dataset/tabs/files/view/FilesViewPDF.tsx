export function FilesViewFilePDF({ source }: { source: string }) {
  return <iframe src={source} className="h-full w-full" />;
}
