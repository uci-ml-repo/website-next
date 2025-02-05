import Image from "next/image";

import Main from "@/components/layout/Main";

interface ErrorGraphicProps {
  code?: number | string;
  header?: string;
  children?: React.ReactNode;
}

export default function ErrorGraphic({
  code,
  header,
  children,
}: ErrorGraphicProps) {
  return (
    <Main className="flex flex-1">
      <div className="flex flex-grow flex-col items-center justify-center space-y-4">
        <Image
          src="/img/anteater.png"
          alt="Anteater"
          width={200}
          height={200}
        />
        <div className="flex flex-col items-center space-y-4">
          {code && <div className="text-7xl text-muted-foreground">{code}</div>}
          {header && <h1 className="text-4xl font-bold">{header}</h1>}
        </div>
        {children}
      </div>
    </Main>
  );
}
