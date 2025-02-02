import Image from "next/image";

import Main from "@/components/layout/Main";
import { HOME_ROUTE } from "@/lib/routes";

export default function Unauthorized() {
  return (
    <Main className="flex flex-col items-center justify-center space-y-4">
      <Image src="/img/anteater.png" alt="Anteater" width={200} height={200} />
      <h1 className="flex flex-col items-center space-y-4">
        <div className="text-7xl text-muted-foreground">401</div>
        <div className="text-4xl font-bold">Unauthorized</div>
      </h1>
      <div className="text-lg">
        <span>Go back </span>
        <a href={HOME_ROUTE} className="text-link">
          Home
        </a>
      </div>
    </Main>
  );
}
