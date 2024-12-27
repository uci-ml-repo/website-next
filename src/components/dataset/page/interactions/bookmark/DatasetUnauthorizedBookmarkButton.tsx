"use client";

import { BookmarkIcon } from "lucide-react";

import SignInButton from "@/components/auth/SignInButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DatasetUnauthorizedBookmarkButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <BookmarkIcon className="size-5 cursor-pointer" />
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Sign in to bookmark datasets</DialogTitle>
        </DialogHeader>
        <p>To bookmark datasets and access others features, please sign in.</p>
        <DialogFooter className="items-center !justify-between">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <SignInButton variant="gold" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
