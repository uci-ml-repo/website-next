import type { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

export function DatasetAboutSideDatum({ title, children }: Props) {
  const blank = <div className="text-muted-foreground/60">&ndash;</div>;

  return (
    <div className="space-y-1">
      <div className="font-bold">{title}</div>
      {children ? children : <div>{blank}</div>}
    </div>
  );
}
