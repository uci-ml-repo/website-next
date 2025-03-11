import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetEditFieldButton } from "@/components/dataset/edit/DatasetEditFieldButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Enums } from "@/db/lib/enums";
import { enumToArray, formatEnum } from "@/lib/utils";

const formSchema = z.object({
  subjectArea: z.enum(enumToArray(Enums.DatasetSubjectArea)),
});

export function DatasetSubjectAreaDialog() {
  const { dataset, editingFields, stopEditingField } = useDataset();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectArea: dataset.subjectArea ?? undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("submit", values);
  }

  const pending = form.formState.isSubmitting;

  return (
    <>
      <DatasetEditFieldButton field="subjectArea" />
      <Dialog
        open={editingFields["subjectArea"]}
        onOpenChange={(open) => {
          if (!open) stopEditingField("subjectArea");
        }}
      >
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subjectArea"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>
                      <DialogTitle>Edit dataset subject area</DialogTitle>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col"
                      >
                        {enumToArray(Enums.DatasetSubjectArea).map(
                          (subjectArea) => (
                            <FormItem
                              key={subjectArea}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={subjectArea} />
                              </FormControl>
                              <FormLabel className="cursor-pointer text-lg font-normal">
                                {formatEnum(subjectArea, false)}
                              </FormLabel>
                            </FormItem>
                          ),
                        )}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="!w-full !justify-between gap-2">
                <DialogClose asChild>
                  <Button variant="secondary" type="button" disabled={pending}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  variant="gold"
                  disabled={pending || !form.watch("subjectArea")}
                >
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
