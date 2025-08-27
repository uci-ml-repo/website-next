"use client";

import type { Session } from "@packages/auth/auth";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode, SyntheticEvent } from "react";
import { useState } from "react";

import { useSessionWithInitial } from "@/components/hooks/use-session-with-initial";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/lib/routes";

interface Props {
  children: ReactNode;
  session?: Session | null;
  onRequireAuth?: () => void;
  dialog?: { title: string; description: ReactNode };
}

export function RequireAuth({ children, session: _session, onRequireAuth, dialog }: Props) {
  const pathname = usePathname();

  const session = useSessionWithInitial(_session ?? null);

  const [dialogOpen, setDialogOpen] = useState(false);

  function intercept(e: SyntheticEvent) {
    if (!session) {
      e.preventDefault();
      e.stopPropagation();
      onRequireAuth?.();
      if (dialog) setDialogOpen(true);
    }
  }

  return (
    <>
      <div
        onPointerDownCapture={intercept}
        onClickCapture={intercept}
        onKeyDownCapture={(e) => {
          if (e.key === "Enter" || e.key === " ") intercept(e);
        }}
      >
        {children}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog?.title}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{dialog?.description}</DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button variant="gold" asChild>
              <Link href={ROUTES.AUTH.SIGN_IN({ callback: pathname })}>
                <LogInIcon />
                Sign In
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
