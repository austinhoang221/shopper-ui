"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import React, { useContext } from "react";
import { CriteriaContext } from "./page";

export type ListCriteria = {
  parent: string;
  key: string;
  check: boolean;
};
const CategoryFilters = () => {
  const {
    criterias,
    criteriaValues,
    priceRange,
    setPriceRangeValue,
    setCriteriaValues,
    isLoading,
  } = useContext(CriteriaContext);
  const onCheckedChange = (key: string, check: boolean) => {
    const newValues = criteriaValues
      ? [...criteriaValues].map((value) => {
          if (value.key === key) value.check = check;
          return value;
        })
      : [];
    setCriteriaValues?.(newValues);
  };
  return (
    <ScrollArea>
      {criterias?.map((criteria) => {
        return (
          <div key={criteria.criteriaName} className="mt-2">
            <h2 className="my-4 font-medium">{criteria.criteriaName}</h2>
            <div className="grid grid-cols-1 gap-2">
              {criteriaValues
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
        min={priceRange?.fromPrice ?? 0}
        max={priceRange?.toPrice ?? 0}
        step={1}
      />
    </ScrollArea>
  );
};

export default CategoryFilters;
