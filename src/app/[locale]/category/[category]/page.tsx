"use client";
import { service } from "@/api/services/service";
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
} from "@/api/services/api";
import Empty from "./Empty";

interface ICriteriaContextProps {
  priceRange?: GetFilterByIdPriceRangeResponse;
  criterias?: GetFilterByIdCriteriaResponse[];
  criteriaValues?: ListCriteria[];
  priceRangeValue?: number[];
  isLoading: boolean;
  setCriterias?: (criterias: GetFilterByIdCriteriaResponse[]) => void;
  setCriteriaValues?: (value: ListCriteria[]) => void;
  setPriceRange?: (priceRange: GetFilterByIdPriceRangeResponse) => void;
  setPriceRangeValue?: (priceRange: number[]) => void;
  setIsLoading?: (isLoading: boolean) => void;
}
export const CriteriaContext = createContext<ICriteriaContextProps>({
  criterias: [],
  criteriaValues: [],
  priceRange: undefined,
  priceRangeValue: [0, 0],
  isLoading: false,
});
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
      {(criterias?.length && criterias?.length > 0) || priceRange ? (
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
