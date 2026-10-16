"use client";

import { Enums, enumToArray } from "@packages/db/enum";
import { useFormContext } from "react-hook-form";

import { CheckboxLabeled } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { DatasetDraftFields } from "@/server/types/dataset/donation";
import { formatEnum } from "@/server/types/util/enum";

export function DatasetDraftDetails() {
  const { control } = useFormContext<DatasetDraftFields>();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={control}
          name="subjectArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject area (required for review)</FormLabel>
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a subject area" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {enumToArray(Enums.DatasetSubjectArea).map((value) => (
                    <SelectItem key={value} value={value}>
                      {formatEnum(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {(
          [
            {
              name: "yearCreated",
              label: "Year created (required for review)",
              min: 1,
              max: new Date().getFullYear(),
            },
            {
              name: "instanceCount",
              label: "Number of instances (required for review)",
              min: 0,
              max: 2_147_483_647,
            },
            { name: "featureCount", label: "Number of features", min: 0, max: 2_147_483_647 },
          ] as const
        ).map(({ name, label, min, max }) => (
          <FormField
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="number"
                    min={min}
                    max={max}
                    step={1}
                    onChange={(event) =>
                      field.onChange(event.target.value === "" ? null : event.target.valueAsNumber)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
      <DatasetDraftOptions
        name="dataTypes"
        label="Data types"
        values={enumToArray(Enums.DatasetDataType)}
      />
      <DatasetDraftOptions
        name="tasks"
        label="Associated tasks"
        values={enumToArray(Enums.DatasetTask)}
      />
      <DatasetDraftOptions
        name="featureTypes"
        label="Feature types"
        values={enumToArray(Enums.DatasetFeatureType)}
      />
      <FormField
        control={control}
        name="citation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Citation information</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(event) => field.onChange(event.target.value || null)}
                maxLength={10_000}
                rows={3}
              />
            </FormControl>
            <FormDescription>
              Include attribution or an existing publication, if available.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function DatasetDraftOptions({
  name,
  label,
  values,
}: {
  name: "dataTypes" | "tasks" | "featureTypes";
  label: string;
  values: string[];
}) {
  const { control } = useFormContext<DatasetDraftFields>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">{label}</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {values.map((value) => (
                <CheckboxLabeled
                  key={value}
                  checked={field.value.some((selected) => selected === value)}
                  onCheckedChange={(checked) =>
                    field.onChange(
                      checked
                        ? [...field.value, value]
                        : field.value.filter((selected) => selected !== value),
                    )
                  }
                >
                  <span className="text-sm">{formatEnum(value)}</span>
                </CheckboxLabeled>
              ))}
            </div>
          </fieldset>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
