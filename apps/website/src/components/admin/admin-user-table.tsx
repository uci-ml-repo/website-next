"use client";

import {
  AlertCircleIcon,
  CircleCheckIcon,
  Loader2Icon,
  MailCheckIcon,
  MailIcon,
  Undo2Icon,
} from "lucide-react";
import type { ReactNode } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa6";

import { AdminUserRole } from "@/components/admin/admin-user-role";
import { useAdminUserFilters } from "@/components/hooks/use-admin-user-filters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PaginationNav } from "@/components/ui/pagination-nav";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/util/cn";
import { skipBatch, trpc } from "@/server/trpc/query/client";
import type { RouterOutput } from "@/server/trpc/router";
import { formatEnum } from "@/server/types/util/enum";

type AdminUser = RouterOutput["user"]["find"]["privilegedByQuery"]["users"][number];

const ACCOUNT_PROVIDERS: Record<
  string,
  { label: string; icon: typeof FaGoogle | typeof MailIcon }
> = {
  google: { label: "Google", icon: FaGoogle },
  github: { label: "GitHub", icon: FaGithub },
  credential: { label: "Email", icon: MailIcon },
};

const CELL = "h-11";

function AccountLogos({ accounts }: { accounts: AdminUser["accounts"] }) {
  const providers = [...new Set(accounts.map((account) => account.providerId))];

  if (!providers.length) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {providers.map((providerId) => {
        const provider = ACCOUNT_PROVIDERS[providerId] ?? {
          label: formatEnum(providerId),
          icon: MailIcon,
        };
        const Icon = provider.icon;

        return (
          <Tooltip key={providerId}>
            <TooltipTrigger asChild>
              <span className="text-foreground inline-flex">
                <Icon className="size-4" />
                <span className="sr-only">{provider.label}</span>
              </span>
            </TooltipTrigger>
            <TooltipContent>{provider.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

function EmailVerifiedIcon({ verified }: { verified: boolean }) {
  if (!verified) {
    return (
      <span className="text-muted-foreground" aria-label="Email not verified">
        —
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <CircleCheckIcon className="text-blue size-4.5" aria-hidden />
          <span className="sr-only">Email verified</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>Email verified</TooltipContent>
    </Tooltip>
  );
}

function AdminUserTableHeader() {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        <TableHead className="w-[24%]">Name</TableHead>
        <TableHead className="w-[32%]">Email</TableHead>
        <TableHead className="w-12">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <MailCheckIcon className="size-4.5" aria-hidden />
                <span className="sr-only">Email verified</span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Email verified</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead className="w-32">Created at</TableHead>
        <TableHead className="w-40">Role</TableHead>
        <TableHead className="w-24">Accounts</TableHead>
      </TableRow>
    </TableHeader>
  );
}

function AdminUserTableFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <Table className="table-fixed">
        <AdminUserTableHeader />
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}

function AdminUserPaginationSkeleton() {
  return (
    <div className="flex h-9 items-center justify-between gap-x-8">
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-9 w-64" />
    </div>
  );
}

function AdminUserTableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-4">
      <AdminUserTableFrame>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index} className="hover:bg-transparent">
            <TableCell className={CELL}>
              <Skeleton className="h-5 w-3/4" />
            </TableCell>
            <TableCell className={CELL}>
              <Skeleton className="h-5 w-5/6" />
            </TableCell>
            <TableCell className={CELL}>
              <Skeleton className="size-4.5" />
            </TableCell>
            <TableCell className={CELL}>
              <Skeleton className="h-5 w-24" />
            </TableCell>
            <TableCell className={CELL}>
              <Skeleton className="h-5 w-16 rounded-full" />
            </TableCell>
            <TableCell className={CELL}>
              <Skeleton className="size-4" />
            </TableCell>
          </TableRow>
        ))}
      </AdminUserTableFrame>
      <AdminUserPaginationSkeleton />
    </div>
  );
}

function AdminUserSearchMessage({
  userCount,
  isFetching,
  error,
}: {
  userCount: number;
  isFetching: boolean;
  error?: string;
}) {
  const { search, nonSearchFilterCount } = useAdminUserFilters();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Search Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const countMessage = (
    <>
      {isFetching ? (
        <Loader2Icon className="inline size-5 -translate-y-0.5 animate-spin" />
      ) : (
        userCount.toLocaleString()
      )}{" "}
      user{userCount !== 1 && "s"}
    </>
  );

  const searchMessage =
    search && `for "${search.length > 30 ? search.slice(0, 30) + "..." : search}"`;

  const filterMessage =
    !!nonSearchFilterCount &&
    `matching ${nonSearchFilterCount} filter${nonSearchFilterCount !== 1 ? "s" : ""}`;

  return (
    (nonSearchFilterCount || search) && (
      <div className="text-muted-foreground px-2 text-lg wrap-anywhere max-md:hidden">
        Found {countMessage} {searchMessage} {filterMessage}
      </div>
    )
  );
}

export function AdminUserTable() {
  const { debouncedFilters, filters, setLimit, clearFilters } = useAdminUserFilters();

  const { data, isFetching, error } = trpc.user.find.privilegedByQuery.useQuery(
    {
      ...filters,
      ...debouncedFilters,
    },
    {
      placeholderData: (prev) => prev,
      ...skipBatch,
    },
  );

  if (!data) {
    if (error) {
      return <AdminUserSearchMessage userCount={0} isFetching={false} error={error.message} />;
    }

    return <AdminUserTableSkeleton rows={filters.limit} />;
  }

  if (!data.users.length) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="text-muted-foreground md:hidden">No users found</div>
        <AdminUserSearchMessage
          userCount={data.count}
          isFetching={isFetching}
          error={error?.message}
        />
        <Button variant="secondary" onClick={clearFilters}>
          Clear search <Undo2Icon />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <AdminUserSearchMessage
        userCount={data.count}
        isFetching={isFetching}
        error={error?.message}
      />

      <div className="space-y-4">
        <AdminUserTableFrame>
          {data.users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className={cn(CELL, "truncate font-medium")}>{user.name}</TableCell>
              <TableCell className={cn(CELL, "text-muted-foreground truncate")}>
                {user.email}
              </TableCell>
              <TableCell className={CELL}>
                <EmailVerifiedIcon verified={user.emailVerified} />
              </TableCell>
              <TableCell className={cn(CELL, "text-muted-foreground")}>
                {new Date(user.createdAt).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className={CELL}>
                <AdminUserRole user={user} />
              </TableCell>
              <TableCell className={CELL}>
                <AccountLogos accounts={user.accounts} />
              </TableCell>
            </TableRow>
          ))}
        </AdminUserTableFrame>

        <PaginationNav
          totalCount={data.count}
          limit={filters.limit}
          cursor={filters.cursor ?? 0}
          onLimitChange={setLimit}
        />
      </div>
    </div>
  );
}
