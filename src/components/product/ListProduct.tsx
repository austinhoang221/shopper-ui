"use client";
import React from "react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { service } from "@/api/services/service";
import {
  OffsetPage,
  ProductOffsetPageStaticQuery,
  ProductOffsetPageStaticResponse,
  ProductStaticFilter,
} from "@/api/services/api";
import { defaultPageSize } from "@/utils/constants";
import UpdateBreadcrumb from "../header/UpdateBreadcrumb";
import { Skeleton } from "../ui/skeleton";
import Product from "./Product";
import { IBreadcrumbState } from "@/reduxConfig/breadcrumbSlice";

type Props = {
  isInfiniteScroll: boolean;
  category: string;
};

const ListProduct = (props: Props) => {
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [products, setProducts] = React.useState<
    ProductOffsetPageStaticResponse[]
  >([]);
  const items: IBreadcrumbState[] = [
    {
      icon: "",
      href: `category/${props.category}`,
      name: props.category.split("-cat.")?.[0],
      key: `k-c-nav-${props.category}`,
    },
  ];

  React.useEffect(() => {
    if (props.category) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.category]);

  const fetchData = async () => {
    setLoading(true);
    if (hasMore) {
      const pageModel = OffsetPage.fromJS({
        pageSize: defaultPageSize,
        pageNumber: page,
      });

      const modelFilter = ProductStaticFilter.fromJS({
        productCategoryId: props.category.split("-cat.")?.[1],
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
      <UpdateBreadcrumb items={items} />
      <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-y-4 gap-2 md:gap-4 ">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
      {props.isInfiniteScroll && (
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
      )}
    </>
    // </div>
  );
};

export default ListProduct;
