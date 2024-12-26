"use client";

import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { SIGN_IN_PATH } from "@/lib/routes";

interface SignInButtonProps extends React.ComponentProps<typeof Button> {}

export default function SignInButton(props: SignInButtonProps) {
  const pathname = usePathname();

  if (pathname === SIGN_IN_PATH) {
    return null;
  }

  return (
    <Button variant={"outline"} asChild {...props}>
      <Link href={SIGN_IN_PATH + `?callbackUrl=${pathname}`}>
        <LogInIcon className={"size-6"} />
        <p>Sign In</p>
      </Link>
    </Button>
  );
}
