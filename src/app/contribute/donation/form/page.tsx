import { ZipFileUploadForm } from "@/components/dataset/forms/ZipFileUploadForm";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-uci-blue">Upload Dataset</h1>
      <ZipFileUploadForm />
    </div>
  );
}
