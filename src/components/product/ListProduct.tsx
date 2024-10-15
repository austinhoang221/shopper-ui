"use client";
import React from "react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Loader2 } from "lucide-react";
import Product, { DummyProduct } from "./Product";
import { getProducts } from "./GetProducts";

type Props = {
  isInfiniteScroll: boolean;
};
const ListProduct = (props: Props) => {
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [products, setProducts] = React.useState<DummyProduct[]>([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setTimeout(async () => {
      if (hasMore) {
        const data = await getProducts(page, 8);
        if (data.products.length < 4) {
          setHasMore(false);
        }
        setProducts((prev) => [...prev, ...data.products]);
        setPage((prev) => prev + 1);
      }

      setLoading(false);
    }, 800);
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
