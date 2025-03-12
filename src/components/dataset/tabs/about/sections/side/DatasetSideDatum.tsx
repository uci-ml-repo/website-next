import React from "react";

export function SideDatum({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const blank = <div className="text-muted-foreground">&ndash;</div>;

  return (
    <div className="space-y-2">
      <div className="text-lg font-bold">{title}</div>
      <div className={className}>{children ? children : blank}</div>
    </div>
  );
}
