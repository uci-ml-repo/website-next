import { cn } from "@/lib/utils";

export function TabHeader({
  icon: Icon,
  title,
  className,
}: {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {Icon && <Icon className="size-6 sm:size-7" />}
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
}
