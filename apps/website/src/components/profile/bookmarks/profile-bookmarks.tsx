"use client";

import type { Session } from "@packages/auth/auth";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { ProfileDatasetSimpleSearch } from "@/components/profile/profile-dataset-simple-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export function ProfileBookmarks({ session }: { session: Session }) {
  const { data: bookmarks } = trpc.bookmark.find.byUserId.useQuery({ userId: session.user.id });

  const empty = (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 max-md:flex-col max-md:text-center">
        <div className="text-pretty">No bookmarks found</div>
        <Button variant="gold" asChild>
          <Link href={ROUTES.SEARCH()}>
            Explore Datasets <ArrowRightIcon />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );

  return <ProfileDatasetSimpleSearch datasets={bookmarks} empty={empty} />;
}
