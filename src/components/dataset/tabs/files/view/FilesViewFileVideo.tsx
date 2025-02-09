export function FilesViewFileVideo({ source }: { source: string }) {
  return (
    <div className="relative flex-1">
      <video
        src={source}
        controls
        preload="auto"
        className="absolute h-full w-full"
      />
    </div>
  );
}
