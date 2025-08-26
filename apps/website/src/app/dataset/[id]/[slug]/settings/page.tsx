import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Page() {
  return (
    <Alert variant="blue">
      <InfoIcon />
      <AlertTitle>Unavailable in Beta</AlertTitle>
      <AlertDescription>Dataset settings are currently unavailable in this beta</AlertDescription>
    </Alert>
  );
}
