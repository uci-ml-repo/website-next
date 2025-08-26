import type { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

export function DatasetAboutSideDatum({ title, children }: Props) {
  const blank = <div className="text-muted-foreground">&ndash;</div>;

  return (
    <div className="space-y-1">
      <div className="font-bold">{title}</div>
      {children ?? <div>{blank}</div>}
    </div>
  );
}
