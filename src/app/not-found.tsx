import Image from "next/image";

import Main from "@/components/layout/Main";
import { HOME_ROUTE } from "@/lib/routes";

export default function NotFound() {
  return (
    <Main className="flex">
      <div className="flex flex-grow flex-col items-center justify-center space-y-4">
        <Image
          src="/img/anteater.png"
          alt="Anteater"
          width={200}
          height={200}
        />
        <h1 className="flex flex-col items-center space-y-4">
          <div className="text-7xl text-muted-foreground">404</div>
          <div className="text-4xl font-bold">Not Found</div>
        </h1>
        <div className="text-lg">
          <span>Go back </span>
          <a href={HOME_ROUTE} className="text-link hover:underline">
            Home
          </a>
        </div>
      </div>
    </Main>
  );
}
