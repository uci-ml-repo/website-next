import { ZipFileInput } from "@/components/ui/zip-file-input";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-uci-blue">Upload Dataset</h1>
      <ZipFileInput />
    </div>
  );
}
