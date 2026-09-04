"use client";

import { authClient } from "@packages/auth/client";
import { Enums, enumToArray } from "@packages/db/enum";
import { AlertCircleIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/util/cn";
import { isAdmin, isHigherRole } from "@/server/trpc/middleware/util/role";
import { trpc } from "@/server/trpc/query/client";
import type { RouterOutput } from "@/server/trpc/router";
import { formatEnum } from "@/server/types/util/enum";

type AdminUser = RouterOutput["user"]["find"]["privilegedByQuery"]["users"][number];

export function AdminUserRole({ user }: { user: AdminUser }) {
  const { data: session } = authClient.useSession();
  const canEditRoles = isAdmin(session?.user.role);

  return (
    <div className="flex items-center gap-1">
      {canEditRoles && <AdminUserRoleEdit user={user} />}
      <Badge variant="secondary">{formatEnum(user.role)}</Badge>
    </div>
  );
}

function AdminUserRoleEdit({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(user.role);

  const utils = trpc.useUtils();
  const updateRole = trpc.user.update.role.useMutation({
    onSuccess: () => {
      toast.success("Role updated");
      setOpen(false);
      utils.user.find.privilegedByQuery.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const verified = user.emailVerified;
  const tooltip = verified
    ? "Edit role"
    : "Cannot edit the role of a user with an unverified email";

  function onOpenChange(next: boolean) {
    if (!verified) return;
    setOpen(next);
    if (next) {
      setRole(user.role);
      updateRole.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("inline-flex", !verified && "cursor-not-allowed")}>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={!verified}
              onClick={() => onOpenChange(true)}
              aria-label={tooltip}
            >
              <PencilIcon />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent side="left">{tooltip}</TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit role</DialogTitle>
          <DialogDescription>Change this user's role.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1 text-sm">
          <div>
            <span className="text-muted-foreground">Name: </span>
            {user.name}
          </div>
          <div>
            <span className="text-muted-foreground">Email: </span>
            {user.email}
          </div>
        </div>

        <Select value={role} onValueChange={(value) => setRole(value as Enums.UserRole)}>
          <SelectTrigger className="w-full" aria-label="User role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {enumToArray(Enums.UserRole).map((userRole) => (
              <SelectItem key={userRole} value={userRole}>
                {formatEnum(userRole)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isHigherRole(role, user.role) && (
          <Alert variant="destructive" className="animate-in fade-in">
            <AlertCircleIcon />
            <AlertTitle>Elevated permissions</AlertTitle>
            <AlertDescription>
              This role grants elevated permissions. Only assign it to trusted users.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={updateRole.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={updateRole.isPending || role === user.role}
            onClick={() => updateRole.mutate({ userId: user.id, role })}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
