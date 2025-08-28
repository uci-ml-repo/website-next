import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function Page() {
  return (
    <Alert variant="blue">
      <InfoIcon />
      <AlertTitle>Unavailable in Beta</AlertTitle>
      <AlertDescription>Profile settings is currently unavailable in this beta</AlertDescription>
    </Alert>
  );
}
