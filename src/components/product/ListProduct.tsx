"use client";
import React, { useContext } from "react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { service } from "@/app/api/services/service";
import {
  OffsetPage,
  ProductOffsetPageStaticQuery,
  ProductOffsetPageStaticResponse,
  ProductStaticFilter,
  ProductStaticSortBy,
} from "@/app/api/services/api";
import { defaultPageSize } from "@/utils/constants";
import { Skeleton } from "../ui/skeleton";
import Product from "./Product";
import { useSearchParams } from "next/navigation";
import Empty from "@/app/[locale]/(pages)/category/[category]/Empty";
import { CriteriaContext } from "@/app/[locale]/(pages)/category/[category]/CriteriaContext";
import debounce from "lodash.debounce";

type Props = {
  category: string;
};

const ListProduct = (props: Props) => {
  const { criteriaValues, priceRangeValue, sortBy } =
    useContext(CriteriaContext);
  const page = React.useRef(1);
  const hasMore = React.useRef(true);
  const itemCount = React.useRef(0);
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState<
    ProductOffsetPageStaticResponse[]
  >([]);
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("q");
  const [isWindow, setIsWindow] = React.useState<boolean>(
    window.innerWidth < 768
  );

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsWindow(true);
      } else {
        setIsWindow(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = React.useCallback(async () => {
    if (hasMore.current) {
      const pageModel = OffsetPage.fromJS({
        pageSize: defaultPageSize,
        pageNumber: page.current,
      });

      const modelFilter = ProductStaticFilter.fromJS({
        productCategoryId: props.category.split("-cat.")?.[1],
        name: searchValue ?? "",
        criterias: criteriaValues
          ?.filter((criteria) => criteria.check)
          ?.map((criteria) => criteria.key),
        priceRange: priceRangeValue,
      });
      const sortByModel = ProductStaticSortBy.fromJS({
        sellingPrice: 1,
      });
      const model = ProductOffsetPageStaticQuery.fromJS({
        page: pageModel,
        filter: modelFilter,
        sortBy: sortByModel,
      });
      const data = await service.client.offset3(model);
      if (itemCount.current + defaultPageSize >= data.totalItemsCount!) {
        hasMore.current = false;
      }
      itemCount.current += data.items?.length ?? 0;
      setProducts((prev) => [...prev, ...data.items!]);
      page.current++;
    }
  }, [props.category, searchValue, criteriaValues, priceRangeValue]);

  const debouncedFetchData = debounce(async () => {
    setLoading(true);
    page.current = 1;
    setProducts([]);
    itemCount.current = 0;
    hasMore.current = true;
    await fetchData();
    setLoading(false);
  }, 500);

  React.useEffect(() => {
    if (props.category) {
      debouncedFetchData();
    }

    return () => {
      debouncedFetchData.cancel();
    };
  }, [searchValue, criteriaValues, priceRangeValue, sortBy, props.category]);

  return (
    <>
      {!loading ? (
        products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-y-4 gap-2 md:gap-4">
              {products.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
            <InfiniteScroll
              hasMore={hasMore.current}
              isLoading={loading}
              next={fetchData}
              threshold={1}
            >
              {hasMore.current && (
                <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-y-4 gap-2 md:gap-4 mt-6">
                  {Array.from({ length: isWindow ? 2 : 4 }).map((_, index) => (
                    <div key={index} className="shadow-lg rounded-lg p-4">
                      <Skeleton className="h-[14rem] rounded-lg bg-gray-200" />
                      <div className="space-y-2 mt-2">
                        <Skeleton className="h-4 w-[9rem] bg-gray-200" />
                        <Skeleton className="h-4 w-[5rem] bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </InfiniteScroll>
          </>
        ) : (
          <Empty />
        )
      ) : (
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
      )}
    </>
  );
};

export default ListProduct;
