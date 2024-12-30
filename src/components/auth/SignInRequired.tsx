"use client";

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
  authedAction: () => void;
  session: Session | null;
  children: React.ReactNode;
}

export default function SignInRequired({
  title,
  body,
  children,
  session,
  authedAction,
}: SignInPromptProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  function onClick() {
    if (!session?.user) {
      setDialogOpen(true);
    } else {
      authedAction();
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div onClick={onClick}>{children}</div>
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
