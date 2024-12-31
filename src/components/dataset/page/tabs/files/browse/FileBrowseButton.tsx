import { cn } from "@/lib/utils";

export default function FileBrowseButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={cn(
        "flex min-w-full items-center space-x-2 rounded-full px-2 py-1 hover:bg-accent",
        "[&>svg]:size-[22px] [&>svg]:shrink-0",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
