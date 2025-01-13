import {
  GetFilterByIdCriteriaResponse,
  GetFilterByIdPriceRangeResponse,
} from "@/app/api/services/api";
import { ListCriteria } from "./CategoryFilters";
import { createContext } from "react";

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
