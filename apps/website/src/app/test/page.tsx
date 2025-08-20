export default function Page() {
  return (
    <div className="flex h-[500px] flex-col overflow-hidden">
      <div className="bg-positive h-10">TOP</div>

      <div className="bg-muted min-h-0 flex-1 overflow-y-auto">
        {Array.from({ length: 1000 }).map((_, i) => (
          <div key={i}>MIDDLE</div>
        ))}
      </div>

      <div className="bg-positive h-10">BOTTOM</div>
    </div>
  );
}
