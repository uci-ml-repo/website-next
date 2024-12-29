"use client";

import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import CreateDiscussionButton from "@/components/dataset/page/tabs/discussion/create/DatasetDiscussionCreateButton";
import DatasetDiscussionCreateInput from "@/components/dataset/page/tabs/discussion/create/DatasetDiscussionCreateInput";
import DatasetDiscussionPost from "@/components/dataset/page/tabs/discussion/view/DatasetDiscussionPost";
import DatasetDiscussionSortBy from "@/components/dataset/page/tabs/discussion/view/DatasetDiscussionSortBy";
import { Card, CardContent } from "@/components/ui/card";
import type { DatasetDiscussionResponse, DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

export default function DatasetDiscussions({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
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
            <DatasetDiscussionCreateInput
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
                    <CreateDiscussionButton
                      text="Start a discussion"
                      session={session}
                      authAction={() => setIsAuthoring(true)}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <CreateDiscussionButton
                text="Add discussion"
                session={session}
                authAction={() => setIsAuthoring(true)}
              />
            ))}

          {discussions.length > 0 && (
            <DatasetDiscussionSortBy sortBy={sortBy} setSortBy={setSortBy} />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion, index) => (
          <DatasetDiscussionPost key={index} discussion={discussion} />
        ))}
      </div>
    </div>
  );
}
