import { InfoIcon } from "lucide-react";
import type { Metadata } from "next";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Admin",
};

export default function Page() {
  return (
    <Alert variant="blue">
      <InfoIcon />
      <AlertTitle>Unavailable in Beta</AlertTitle>
      <AlertDescription>Admin features are currently unavailable in this beta</AlertDescription>
    </Alert>
  );
}
