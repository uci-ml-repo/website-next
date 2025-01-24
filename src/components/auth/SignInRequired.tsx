"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import { useState } from "react";

import SignInButton from "@/components/auth/SignInButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SignInPromptProps {
  title: string;
  body: string;
  authedAction?: () => void;
  authedRedirect?: string;
  session: Session | null;
  children: React.ReactNode;
}

export default function SignInRequired({
  title,
  body,
  children,
  session,
  authedAction,
  authedRedirect,
}: SignInPromptProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  function onClick(e: React.MouseEvent) {
    if (!session?.user) {
      e.preventDefault();
      setDialogOpen(true);
    } else if (authedAction) {
      authedAction();
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {authedAction ? (
        <div onClick={onClick}>{children}</div>
      ) : authedRedirect ? (
        <div>
          <Link href={authedRedirect} onClick={onClick}>
            {children}
          </Link>
        </div>
      ) : (
        children
      )}
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p>{body}</p>
        <DialogFooter className="items-center !justify-between gap-4">
          <DialogClose asChild>
            <Button variant="secondary" className="max-sm:w-full">
              Cancel
            </Button>
          </DialogClose>
          <SignInButton className="max-sm:w-full" variant="gold" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
