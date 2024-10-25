"use client";
import { GetFilterByIdResponse } from "@/api/services/api";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import React from "react";

type Props = {
  criterias: GetFilterByIdResponse;
};
type ListCriteria = {
  parent: string;
  key: string;
  check: boolean;
};
const CategoryFilters = (props: Props) => {
  const initialValue: ListCriteria[] =
    props.criterias?.criterias?.reduce<ListCriteria[]>((acc, criteria) => {
      const flat: ListCriteria[] =
        criteria.values?.map((value) => ({
          parent: criteria.criteriaName ?? "",
          key: value ?? "",
          check: false,
        })) || [];

      return acc.concat(flat);
    }, []) || [];
  const [values, setValues] = React.useState(initialValue);

  const onCheckedChange = (key: string, check: boolean) => {
    const newValues = [...values].map((value) => {
      if (value.key === key) value.check = check;
      return value;
    });
    setValues(newValues);
  };
  return (
    <ScrollArea>
      {props.criterias?.criterias?.map((criteria) => {
        return (
          <div key={criteria.criteriaName} className="mt-2">
            <h2 className="my-4 font-medium">{criteria.criteriaName}</h2>
            <div className="grid grid-cols-1 gap-2">
              {values
                ?.filter((value) => value.parent === criteria.criteriaName)
                .map((value) => (
                  <div key={value.key} className="flex gap-2">
                    <Checkbox
                      id={value.key}
                      checked={value.check}
                      onCheckedChange={(checked) =>
                        onCheckedChange(value.key, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={value.key}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {value.key}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
      <h2 className="my-4 font-medium">Price range</h2>
      <Slider
        min={props.criterias?.priceRange?.fromPrice ?? 0}
        max={props.criterias?.priceRange?.toPrice ?? 0}
        step={1}
      />
    </ScrollArea>
  );
};

export default CategoryFilters;
