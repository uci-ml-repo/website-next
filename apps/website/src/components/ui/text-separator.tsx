import { Separator } from "@components/ui/separator";

export function TextSeparator({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Separator className="flex w-fit grow" />
      <span className="text-muted-foreground text-sm">{text}</span>
      <Separator className="flex w-fit grow" />
    </div>
  );
}
