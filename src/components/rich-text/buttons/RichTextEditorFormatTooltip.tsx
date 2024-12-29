import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RichTextEditorFormatTooltip({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  return (
    <Tooltip delayDuration={300} disableHoverableContent>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
}
