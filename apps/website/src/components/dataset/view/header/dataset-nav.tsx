"use client";

import type { Session } from "@packages/auth/auth";
import { SettingsIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

import { useScrollEdges } from "@/components/hooks/use-scroll-edges";
import { useSessionWithInitial } from "@/components/hooks/use-session-with-initial";
import type { NavTab } from "@/components/ui/nav-tabs";
import { NavTabs } from "@/components/ui/nav-tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/util/cn";
import { isPriviliged } from "@/server/trpc/middleware/util/role";
import type { DatasetFull } from "@/server/types/dataset/response";

type Props = HTMLAttributes<HTMLElement> & {
  dataset: DatasetFull;
  session: Session | null;
};

export function DatasetNav({ dataset, session: _session, ...props }: Props) {
  const session = useSessionWithInitial(_session);

  const tabs: NavTab[] = [{ display: "About", path: ROUTES.DATASET(dataset) }];

  if (!dataset.externalLink) {
    tabs.push({ display: "Files", path: ROUTES.DATASET.FILES(dataset) });
  }

  if (session && (session.user.id === dataset.userId || isPriviliged(session.user.role))) {
    tabs.push({
      display: <SettingsIcon className="size-5.5" aria-label="Dataset settings" />,
      path: ROUTES.DATASET.SETTINGS(dataset),
    });
  }

  const { ref, edges } = useScrollEdges<HTMLDivElement>(2);

  return (
    <ScrollArea
      horizontal
      className={cn(
        "min-w-0 flex-1",
        !edges.atLeft && "mask-l-from-[calc(100%-16px)] mask-l-to-100%",
        !edges.atRight && "mask-r-from-[calc(100%-16px)] mask-r-to-100%",
      )}
      type="always"
      viewportRef={ref}
    >
      <NavTabs aria-label="Dataset tabs" tabs={tabs} {...props} />{" "}
    </ScrollArea>
  );
}
