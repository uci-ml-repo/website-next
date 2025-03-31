import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { toast } from "@/components/hooks/use-toast";
import { AlertWarning } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Enums } from "@/db/lib/enums";
import type { UserSelect } from "@/db/lib/types";
import { cn, formatEnum } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

const UserRole = Enums.UserRole;

export function UserRow({ user }: { user: UserSelect }) {
  return (
    <TableRow>
      <TableCell className="truncate max-sm:hidden">{user.name}</TableCell>
      <TableCell className="truncate">
        <div className="flex items-center space-x-1">
          <div>{user.email}</div>
          {user.emailVerified && (
            <Tooltip>
              <TooltipTrigger aria-label="Email Verified">
                <CheckIcon className="size-5 text-positive" />
              </TooltipTrigger>
              <TooltipContent>Email Verified</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
      <TableCell>
        <UserRoleSelect user={user} />
      </TableCell>
    </TableRow>
  );
}

function UserRoleSelect({ user }: { user: UserSelect }) {
  const { data: session } = useSession();

  const [roleSelect, setRoleSelect] = useState<Enums.UserRole>(user.role);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [changeToRole, setChangeToRole] = useState<Enums.UserRole>(roleSelect);

  const roleChangeMutation = trpc.user.update.role.useMutation({
    onSuccess: async () => {
      user.role = changeToRole;
      setRoleSelect(changeToRole);
      setDialogOpen(false);

      if (user.email === session?.user.email) {
        await signOut();
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error changing role",
        description: error.message,
      });
    },
  });

  function openChangeRoleDialog(value: Enums.UserRole) {
    setChangeToRole(value);
    setDialogOpen(true);
  }

  function changeRole() {
    roleChangeMutation.mutate({
      userId: user.id,
      role: changeToRole,
    });
  }

  const pending = roleChangeMutation.isPending;

  return (
    <>
      <Select
        value={roleSelect}
        onValueChange={(value) => openChangeRoleDialog(value as Enums.UserRole)}
      >
        <SelectTrigger
          size="sm"
          className={cn("min-w-28", {
            "[&_span]:!text-destructive-muted": roleSelect === UserRole.ADMIN,
          })}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={UserRole.ADMIN} className="!text-destructive-muted">
            Admin
          </SelectItem>
          <SelectItem value={UserRole.LIBRARIAN}>Librarian</SelectItem>
          <SelectItem value={UserRole.CURATOR}>Curator</SelectItem>
          <SelectItem value={UserRole.BASIC}>Basic</SelectItem>
        </SelectContent>
      </Select>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm role change to {formatEnum(changeToRole)}?</DialogTitle>
          <div className="space-y-4">
            <div>
              User: <span className="font-semibold">{user.email}</span>
            </div>
            {user.email === session?.user.email && (
              <AlertWarning>You are changing your own role. You will be signed out.</AlertWarning>
            )}
            <div className="flex items-center justify-around border-y py-4">
              <div
                className={cn({
                  "text-destructive-muted": user.role === UserRole.ADMIN,
                })}
              >
                {formatEnum(user.role)}
              </div>
              <ArrowRightIcon className="size-6 text-muted-foreground" />
              <div
                className={cn({
                  "text-destructive-muted": changeToRole === UserRole.ADMIN,
                })}
              >
                {formatEnum(changeToRole)}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-2 !justify-between gap-2">
            <DialogClose asChild disabled={pending}>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button variant="blue" onClick={changeRole} disabled={pending}>
              {pending && <Spinner />} Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
