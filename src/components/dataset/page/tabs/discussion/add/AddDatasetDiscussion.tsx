"use client";

import { useState } from "react";

import AddDatasetDiscussionInput from "@/components/dataset/page/tabs/discussion/add/AddDatasetDiscussionInput";
import AddDatasetDiscussionButton from "@/components/dataset/page/tabs/discussion/add/AddDatasetDiscusssionButton";
import type { DatasetDiscussionResponse, DatasetResponse } from "@/lib/types";

export default function AddDatasetDiscussion({
  dataset,
  discussions,
}: {
  dataset: DatasetResponse;
  discussions: DatasetDiscussionResponse[];
}) {
  const [isAuthoring, setIsAuthoring] = useState<boolean>(false);

  return (
    <>
      {!isAuthoring ? (
        <AddDatasetDiscussionButton
          hasDiscussions={discussions.length === 0}
          setIsAuthoring={setIsAuthoring}
        />
      ) : (
        <AddDatasetDiscussionInput
          dataset={dataset}
          setIsAuthoring={setIsAuthoring}
        />
      )}
    </>
  );
}
