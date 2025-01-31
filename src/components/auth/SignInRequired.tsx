"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
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

interface SignInRequiredProps {
  title: string;
  body: string;
  authedAction?: () => void;
  authedRedirect?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function SignInRequired({
  title,
  body,
  disabled,
  children,
  authedAction,
  authedRedirect,
}: SignInRequiredProps) {
  const { data: session } = useSession();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  function onClick(e: React.MouseEvent) {
    if (disabled) {
      return;
    }

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
        <div onClick={onClick} className="w-fit">
          {children}
        </div>
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
            <Button
              variant="secondary"
              className="max-sm:w-full"
              disabled={disabled}
            >
              Cancel
            </Button>
          </DialogClose>
          <SignInButton className="max-sm:w-full" variant="gold" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
