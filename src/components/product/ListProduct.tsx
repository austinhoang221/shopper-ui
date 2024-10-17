"use client";
import React from "react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Loader2 } from "lucide-react";
import Product from "./Product";
import { service } from "@/api/services/service";
import {
  OffsetPage,
  ProductOffsetPageStaticQuery,
  ProductResponse,
  ProductStaticFilter,
} from "@/api/services/client";
import { defaultPageSize } from "@/utils/constants";

type Props = {
  isInfiniteScroll: boolean;
  category: string;
};
const ListProduct = (props: Props) => {
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [products, setProducts] = React.useState<ProductResponse[]>([]);

  React.useEffect(() => {
    if (props.category) fetchData();
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
      const data = await service.client.offset(model);
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
      <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-y-4 gap-4 mt-6">
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
            <div className="w-full flex justify-center mt-4">
              <Loader2 className="my-4 text-black h-12 w-12 animate-spin" />
            </div>
          )}
        </InfiniteScroll>
      )}
    </>
    // </div>
  );
};

export default ListProduct;
