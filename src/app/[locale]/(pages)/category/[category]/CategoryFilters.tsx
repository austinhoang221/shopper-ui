"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import React, { useContext } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CriteriaContext } from "./CriteriaContext";

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
    priceRangeValue,
    setPriceRangeValue,
    setCriteriaValues,
    isLoading,
  } = useContext(CriteriaContext);
  const [priceRangeFilter, setPriceRangeFilter] =
    React.useState(priceRangeValue);
  const onCheckedChange = (key: string, check: boolean) => {
    const newValues = criteriaValues
      ? [...criteriaValues].map((value) => {
          if (value.key === key) value.check = check;
          return value;
        })
      : [];
    setCriteriaValues?.(newValues);
  };

  const onPriceRangeChange = (range: number[]) => {
    setPriceRangeFilter(range);
  };
  return (
    <ScrollArea className="h-screen">
      {!isLoading ? (
        <>
          {criterias?.map((criteria) => (
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
          ))}
          <h2 className="my-4 font-medium">Price range</h2>
          <Slider
            minStepsBetweenThumbs={1}
            max={priceRange?.toPrice}
            min={priceRange?.fromPrice}
            value={priceRangeFilter}
            step={1}
            onValueChange={onPriceRangeChange}
            className="w-full"
          />
          <div className="italic text-muted-foreground mt-2 text-center">
            {priceRangeFilter?.[0]} to {priceRangeFilter?.[1]}
          </div>
          <Button
            className="w-full mt-4"
            onClick={() => setPriceRangeValue?.(priceRangeFilter ?? [])}
          >
            Apply
          </Button>
        </>
      ) : (
        <div className="">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="py-4">
              <Skeleton className="h-4 w-full bg-gray-200" />
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-1/2 bg-gray-200" />
                <Skeleton className="h-4 w-1/2 bg-gray-200" />
                <Skeleton className="h-4 w-1/2 bg-gray-200" />
                <Skeleton className="h-4 w-1/2 bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default CategoryFilters;
