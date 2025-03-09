import { PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DatasetSettingsGraphicsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <PencilIcon /> Edit thumbnail
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit thumbnail</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
