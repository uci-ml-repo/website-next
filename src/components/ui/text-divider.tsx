import * as React from "react";

interface TextDividerProps {
  text: string;
}

export default function TextDivider({ text }: TextDividerProps) {
  return (
    <div className="my-2 flex items-center justify-center gap-2">
      <div className="h-[0.5px] w-full bg-muted-foreground" />
      <span className="text-sm text-muted-foreground">{text}</span>
      <div className="h-[0.5px] w-full bg-muted-foreground" />
    </div>
  );
}
