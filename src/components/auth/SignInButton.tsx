"use client";

import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SIGN_IN_PATH } from "@/lib/routes";

export default function SignInButton() {
  const pathname = usePathname();

  if (pathname === SIGN_IN_PATH) {
    return null;
  }

  return (
    <Button variant={"outline"} asChild pill>
      <Link href={SIGN_IN_PATH + `?callbackUrl=${pathname}`}>
        <LogInIcon className={"size-6"} />
        <p>Sign In</p>
      </Link>
    </Button>
  );
}
