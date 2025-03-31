"use client";

import { LogInIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { SIGN_IN_ROUTE } from "@/lib/routes";

interface SignInButtonProps extends React.ComponentProps<typeof Button> {}

export function SignInButton(props: SignInButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [hash, setHash] = useState<string>();

  useEffect(() => {
    setHash(window.location.hash);

    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (pathname === SIGN_IN_ROUTE) {
    return null;
  }

  const redirectUrl = `${pathname || ""}${searchParams.toString() ? `?${searchParams.toString()}` : ""}${hash}`;

  return (
    <Button variant="outline" asChild {...props}>
      <a href={`${SIGN_IN_ROUTE}?redirectUrl=${encodeURIComponent(redirectUrl)}`}>
        <LogInIcon className="size-6" />
        <p>Sign In</p>
      </a>
    </Button>
  );
}
