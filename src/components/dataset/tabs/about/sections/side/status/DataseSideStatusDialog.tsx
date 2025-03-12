import { ArrowRightIcon } from "lucide-react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetStatusBadge } from "@/components/dataset/DatasetStatusBadge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DatasetSideStatusDialog() {
  const { dataset, editingFields, stopEditingField } = useDataset();

  return (
    <Dialog
      open={editingFields["status"]}
      onOpenChange={(open) => {
        if (!open) stopEditingField("status");
      }}
    >
      <DialogContent>
        <DialogTitle>Edit dataset status</DialogTitle>
        <div className="flex items-center justify-around border-y py-4">
          <DatasetStatusBadge status={dataset.status} size="lg" />
          <ArrowRightIcon className="size-6 text-muted-foreground" />
          <Select defaultValue={dataset.status}>
            <SelectTrigger className="w-36 p-1" size="lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="draft" className="px-2">
                  <DatasetStatusBadge status="draft" size="lg" />
                </SelectItem>
                <SelectItem value="pending" className="px-2">
                  <DatasetStatusBadge status="pending" size="lg" />
                </SelectItem>
                <SelectItem value="approved" className="px-2">
                  <DatasetStatusBadge status="approved" size="lg" />
                </SelectItem>
                <SelectItem value="rejected" className="px-2">
                  <DatasetStatusBadge status="rejected" size="lg" />
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}
