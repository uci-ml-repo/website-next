import Spinner from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="mt-8 flex w-full justify-center">
      <Spinner className="size-10" />
    </div>
  );
}
