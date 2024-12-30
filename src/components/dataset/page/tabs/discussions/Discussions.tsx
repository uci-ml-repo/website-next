"use client";

import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import DiscussionCreateButton from "@/components/dataset/page/tabs/discussions/create/DiscussionCreateButton";
import DiscussionCreateInput from "@/components/dataset/page/tabs/discussions/create/DiscussionCreateInput";
import DiscussionsSortBy from "@/components/dataset/page/tabs/discussions/DiscussionsSortBy";
import Discussion from "@/components/dataset/page/tabs/discussions/view/Discussion";
import { Card, CardContent } from "@/components/ui/card";
import type { DatasetDiscussionResponse, DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

export default function Discussions({ dataset }: { dataset: DatasetResponse }) {
  const { data: session } = useSession();

  const [isAuthoring, setIsAuthoring] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("top");
  const [discussions, setDiscussions] = useState<DatasetDiscussionResponse[]>(
    [],
  );

  const discussionsQuery = trpc.discussions.find.byQuery.useQuery({
    datasetId: dataset.id,
  });

  useEffect(() => {
    if (discussionsQuery.data) {
      setDiscussions(discussionsQuery.data);
    }
  }, [discussionsQuery.data]);

  if (discussionsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  function insertDiscussion(discussion: DatasetDiscussionResponse) {
    setDiscussions((prev) => [discussion, ...prev]);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Discussions</h2>

      <div>
        {isAuthoring && (
          <motion.div
            initial={{ height: 0, marginBottom: 0 }}
            animate={{
              height: "auto",
              marginBottom: 24,
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <DiscussionCreateInput
              dataset={dataset}
              setIsAuthoring={setIsAuthoring}
              insertDiscussion={insertDiscussion}
            />
          </motion.div>
        )}
        <div className="flex items-center space-x-6">
          {!isAuthoring &&
            (discussions.length === 0 ? (
              <Card className="w-full">
                <CardContent className="flex h-[130px] items-center justify-center">
                  <div className="space-y-4 text-center">
                    <div className="text-muted-foreground">
                      There are no discussions yet
                    </div>
                    <DiscussionCreateButton
                      text="Start a discussion"
                      session={session}
                      authAction={() => setIsAuthoring(true)}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <DiscussionCreateButton
                text="Add discussion"
                session={session}
                authAction={() => setIsAuthoring(true)}
              />
            ))}

          {discussions.length > 0 && (
            <DiscussionsSortBy sortBy={sortBy} setSortBy={setSortBy} />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion, index) => (
          <Discussion key={index} discussion={discussion} />
        ))}
      </div>
    </div>
  );
}
