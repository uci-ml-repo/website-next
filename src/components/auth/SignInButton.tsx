"use client";

import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SIGN_IN_PATH } from "@/globals";

export default function SignInButton() {
  const pathname = usePathname();

  if (pathname === SIGN_IN_PATH) {
    return <> </>;
  }

  return (
    <Button variant={"ghost"} size={"lg"} asChild pill>
      <Link href={SIGN_IN_PATH}>
        <LogInIcon className={"size-6"} />
        <p>Sign In</p>
      </Link>
    </Button>
  );
}
