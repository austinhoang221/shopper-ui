"use client";
import React, { useContext } from "react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { service } from "@/api/services/service";
import {
  OffsetPage,
  ProductOffsetPageStaticQuery,
  ProductOffsetPageStaticResponse,
  ProductStaticFilter,
} from "@/api/services/api";
import { defaultPageSize } from "@/utils/constants";
import { Skeleton } from "../ui/skeleton";
import Product from "./Product";
import { useSearchParams } from "next/navigation";
import { CriteriaContext } from "@/app/[locale]/category/[category]/page";

type Props = {
  category: string;
};

const ListProduct = (props: Props) => {
  const { criteriaValues, priceRangeValue, isLoading } =
    useContext(CriteriaContext);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [products, setProducts] = React.useState<
    ProductOffsetPageStaticResponse[]
  >([]);
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("q");

  React.useEffect(() => {
    if (props.category) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.category, criteriaValues, priceRangeValue]);

  const fetchData = async () => {
    setLoading(true);
    if (hasMore) {
      const pageModel = OffsetPage.fromJS({
        pageSize: defaultPageSize,
        pageNumber: page,
      });

      const modelFilter = ProductStaticFilter.fromJS({
        productCategoryId: props.category.split("-cat.")?.[1],
        name: searchValue ?? "",
        criterias: criteriaValues
          ?.filter((criteria) => criteria.check)
          .map((criteria) => criteria.key),
        priceRange: [priceRangeValue?.fromPrice, priceRangeValue?.toPrice],
      });
      const model = ProductOffsetPageStaticQuery.fromJS({
        page: pageModel,
        filter: modelFilter,
      });
      const data = await service.client.offset2(model);
      if (products?.length + defaultPageSize >= data.totalItemsCount!) {
        setHasMore(false);
      }
      setProducts((prev) => [...prev, ...data.items!]);
      setPage((prev) => prev + 1);
    }

    setLoading(false);
  };
  return (
    // <div className="max-h-[300px] w-full overflow-y-auto px-10">
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-y-4 gap-2 md:gap-4 ">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
      <InfiniteScroll
        hasMore={hasMore}
        isLoading={loading}
        next={fetchData}
        threshold={1}
      >
        {hasMore && (
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
    // </div>
  );
};

export default ListProduct;
