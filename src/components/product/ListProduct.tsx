"use client";
import React, { useContext } from "react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { service } from "@/app/api/services/service";
import {
  OffsetPage,
  ProductOffsetPageStaticQuery,
  ProductOffsetPageStaticResponse,
  ProductStaticFilter,
} from "@/app/api/services/api";
import { defaultPageSize } from "@/utils/constants";
import { Skeleton } from "../ui/skeleton";
import Product from "./Product";
import { useSearchParams } from "next/navigation";
import Empty from "@/app/[locale]/(pages)/category/[category]/Empty";
import { CriteriaContext } from "@/app/[locale]/(pages)/category/[category]/CriteriaContext";

type Props = {
  category: string;
};

const ListProduct = (props: Props) => {
  const { criteriaValues, priceRangeValue } = useContext(CriteriaContext);
  const page = React.useRef(1);
  const hasMore = React.useRef(true);
  const itemCount = React.useRef(0);
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState<
    ProductOffsetPageStaticResponse[]
  >([]);
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("q");

  // React.useEffect(() => {
  //   if (props.category) fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.category]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
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
      const model = ProductOffsetPageStaticQuery.fromJS({
        page: pageModel,
        filter: modelFilter,
      });
      const data = await service.client.offset3(model);
      if (itemCount.current + defaultPageSize >= data.totalItemsCount!) {
        hasMore.current = false;
      }
      itemCount.current += data.items?.length ?? 0;
      setProducts((prev) => [...prev, ...data.items!]);
      page.current++;
    }

    setLoading(false);
  }, [searchValue, criteriaValues, priceRangeValue]);

  React.useEffect(() => {
    if (props.category) {
      page.current = 1;
      setProducts([]);
      itemCount.current = 0;
      hasMore.current = true;
      fetchData();
    }
  }, [searchValue, criteriaValues, priceRangeValue]);

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
                  {Array.from({ length: 4 }).map((_, index) => (
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
