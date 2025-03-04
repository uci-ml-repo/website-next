"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { SignInButton } from "@/components/auth/SignInButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PROFILE_SETTINGS_ROUTE } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface EmailVerificationRequiredProps {
  signInTitle: string;
  signInBody: string;
  verificationTitle: string;
  verificationBody: string;
  verifiedAction?: () => void;
  verifiedRedirect?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function VerificationRequired({
  signInTitle,
  signInBody,
  verificationTitle,
  verificationBody,
  disabled,
  children,
  verifiedAction,
  verifiedRedirect,
}: EmailVerificationRequiredProps) {
  const { data: session } = useSession();

  const [verifyDialogOpen, setVerifyDialogOpen] = useState<boolean>(false);
  const [signInDialogOpen, setSignInDialogOpen] = useState<boolean>(false);

  function onClick(e: React.MouseEvent) {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (!session?.user) {
      e.preventDefault();
      setSignInDialogOpen(true);
    } else if (!session.user.emailVerified) {
      e.preventDefault();
      setVerifyDialogOpen(true);
    } else if (verifiedAction) {
      verifiedAction();
    }
  }

  return (
    <>
      {verifiedAction ? (
        <div onClick={onClick} className="w-fit">
          {children}
        </div>
      ) : verifiedRedirect ? (
        <div>
          <Link
            href={verifiedRedirect}
            onClick={onClick}
            tabIndex={-1}
            aria-disabled={disabled}
            className={cn({ "cursor-default": disabled })}
          >
            {children}
          </Link>
        </div>
      ) : (
        children
      )}

      {/* Verify Email Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{verificationTitle}</DialogTitle>
          </DialogHeader>
          <p>{verificationBody}</p>
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
            <Button asChild variant="gold" className="max-sm:w-full">
              <Link href={PROFILE_SETTINGS_ROUTE}>Verify Email</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sign In Dialog */}
      <Dialog open={signInDialogOpen} onOpenChange={setSignInDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{signInTitle}</DialogTitle>
          </DialogHeader>
          <p>{signInBody}</p>
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
    </>
  );
}
