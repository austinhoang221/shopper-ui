"use client";
import { service } from "@/app/api/services/service";
import ListProduct from "@/components/product/ListProduct";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { convertHandleToString } from "@/utils/utils";
import {
  faChevronCircleDown,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createContext } from "react";
import CategoryFilters, { ListCriteria } from "./CategoryFilters";
import {
  GetFilterByIdCriteriaResponse,
  GetFilterByIdPriceRangeResponse,
} from "@/app/api/services/api";
import Empty from "./Empty";
import { Skeleton } from "@/components/ui/skeleton";
import { CriteriaContext } from "./CriteriaContext";

export default function ProductByCategory({
  params,
}: Readonly<{ params: { category: string } }>) {
  const [criterias, setCriterias] = React.useState<
    GetFilterByIdCriteriaResponse[] | undefined
  >([]);
  const [criteriaValues, setCriteriaValues] = React.useState<
    ListCriteria[] | undefined
  >([]);
  const [priceRange, setPriceRange] = React.useState<
    GetFilterByIdPriceRangeResponse | undefined
  >(undefined);
  const [priceRangeValue, setPriceRangeValue] = React.useState<number[]>([
    0, 0,
  ]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await service.client.filters(
        params.category.split("-cat.")[1]
      );
      setCriterias(data?.criterias ?? []);
      const initialCriteriaValue: ListCriteria[] =
        data?.criterias?.reduce<ListCriteria[]>((acc, criteria) => {
          const flat: ListCriteria[] =
            criteria.values?.map((value) => ({
              parent: criteria.criteriaName ?? "",
              key: value ?? "",
              check: false,
            })) || [];

          return acc.concat(flat);
        }, []) || [];
      setCriteriaValues([...new Set(initialCriteriaValue)]);
      setPriceRange(data?.priceRange ?? undefined);
      setPriceRangeValue(
        data?.priceRange
          ? [data?.priceRange?.fromPrice ?? 0, data?.priceRange?.toPrice ?? 0]
          : []
      );
      setIsLoading(false);
    };
    fetchData();
  }, [params.category]);
  return (
    <CriteriaContext.Provider
      value={{
        priceRange,
        criterias,
        criteriaValues,
        priceRangeValue,
        isLoading,
        setCriterias,
        setCriteriaValues,
        setPriceRangeValue,
        setIsLoading,
        setPriceRange,
      }}
    >
      <div className="block md:flex mt-4 justify-between">
        <h1 className="text-xl font-bold truncate mb-2 md:mb-0">
          {convertHandleToString(params.category.split("-cat")[0])}
        </h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger type="button">
              <FontAwesomeIcon
                className="ml-2"
                icon={faChevronCircleDown}
                width={18}
                height={18}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent aria-label="Static Actions">
              <DropdownMenuGroup>
                <DropdownMenuItem key="asc">
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem key="dsc">
                  Price: High to Low
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger className="block sm:hidden">
              <FontAwesomeIcon
                className="ml-2"
                icon={faFilter}
                width={18}
                height={18}
              />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <h1 className="font-bold my-2">Price</h1>
              <Separator className="bg-[#d5dbdb]" />
              <CategoryFilters />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isLoading ? (
        <div className="hidden md:grid grid-cols-12 gap-4 mt-2">
          <div className="col-span-2">
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

          <div className="col-span-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-y-4 gap-2 md:gap-4 mt-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="shadow-lg rounded-lg p-4">
                  <Skeleton className="h-[14rem] rounded-lg bg-gray-200" />
                  <div className="space-y-2 mt-2">
                    <Skeleton className="h-4 w-[9rem] bg-gray-200" />
                    <Skeleton className="h-4 w-[5rem] bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (criterias?.length && criterias?.length > 0) || priceRange ? (
        <>
          <div className="hidden md:grid grid-cols-12 gap-4 mt-2">
            <div className="col-span-2">
              <h1 className="text-lg font-bold">Filters</h1>
              <CategoryFilters />
            </div>
            <div className="col-span-10">
              <ListProduct category={params.category} />
            </div>
          </div>
          <div className="block md:hidden">
            <ListProduct category={params.category} />
          </div>
        </>
      ) : (
        <Empty />
      )}
    </CriteriaContext.Provider>
  );
}
