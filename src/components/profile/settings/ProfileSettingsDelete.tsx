"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { CONTACT_ROUTE, HOME_ROUTE } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export function ProfileSettingsDelete() {
  const { data: session } = useSession();

  const [confirmInput, setConfirmInput] = useState<string>("");

  const userDeleteMutation = trpc.user.remove.byId.useMutation();

  const deleting = userDeleteMutation.isPending || userDeleteMutation.isSuccess;

  function deleteAccount() {
    if (!session) return;

    userDeleteMutation.mutate({
      userId: session.user.id,
    });

    signOut({ redirect: true, redirectTo: HOME_ROUTE });
  }

  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-lg font-bold">Delete Account</h3>
        <p className="text-lg text-muted-foreground">
          Permanently delete you UCI Machine Learning Repository account
        </p>
      </div>

      {session ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline-destructive">Delete Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Permanently delete your account</DialogTitle>
            <DialogHeader>
              <div className="text-destructive">
                Warning: this action cannot be undone.
              </div>
              <ul className="list-inside list-disc">
                <li>
                  You will no longer have access to any datasets donated by you
                </li>
                <li>Your discussion posts and comments will be deleted</li>
              </ul>
            </DialogHeader>

            <div className="space-y-4 text-muted-foreground">
              <div>
                For account related questions{" "}
                <Link href={CONTACT_ROUTE} className="underline">
                  Contact us
                </Link>
              </div>
              <div className="space-y-1">
                <div>
                  To confirm, type your email{" "}
                  <span className="font-bold">{session.user.email}</span> below
                </div>
                <Input
                  onChange={(e) => setConfirmInput(e.target.value)}
                  value={confirmInput}
                />
              </div>
            </div>

            <DialogFooter className="items-center !justify-between gap-4">
              <Button variant="secondary">Cancel</Button>
              <Button
                variant="destructive"
                disabled={confirmInput !== session.user.email || deleting}
                onClick={deleteAccount}
              >
                {deleting && <Spinner />} Delete account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="flex h-10 items-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
