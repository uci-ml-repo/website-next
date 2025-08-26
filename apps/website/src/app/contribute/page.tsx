"use client";

import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Contribution from "./contribution.mdx";

export default function Page() {
  return (
    <div className="blur-background mx-auto max-w-4xl">
      <Contribution />
      <Alert variant="blue">
        <InfoIcon />
        <AlertTitle>Unavailable in Beta</AlertTitle>
        <AlertDescription>
          Contributing datasets is currently unavailable in this beta
        </AlertDescription>
      </Alert>
    </div>
  );
}
