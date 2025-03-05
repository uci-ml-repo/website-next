import { TabHeader } from "@/components/ui/tab-header";

export default function Page() {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <TabHeader title="Changelog" />
        <div className="text-muted-foreground">(Only visible to you)</div>
      </div>
    </div>
  );
}
