export function DatasetFileViewFileAudio({ source }: { source: string }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <audio src={source} controls />
    </div>
  );
}
