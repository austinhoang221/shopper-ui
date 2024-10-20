"use client";

import { ProductResponse } from "@/api/services/client";
import { Button } from "@/components/ui/button";
import InputNumber from "@/components/ui/input-number";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/reduxConfig/cartSlice";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  product: ProductResponse;
};

const DetailContent = (props: Props) => {
  const dispatch = useAppDispatch();
  const { product } = props;
  const { toast } = useToast();
  const router = useRouter();
  const url = window.location.pathname;
  const language = url.split("/")[1];
  const [quantity, setQuantity] = React.useState(1);
  return (
    <div>
      <h1 className="text-xl mb-2">{product.name}</h1>
      <h1 className="text-xl text-primary font-bold p-4 bg-muted mb-2">
        {product.sellingPrice}$
      </h1>

      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground">Sku</span>
        <span>{product.productCd}</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground">Unit</span>
        <span>{product.unit}</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground">Weight</span>
        <span>{product.weight} gram</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground">In stock</span>
        <span>{product.stock}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Quantity</span>
        <InputNumber
          onChange={(value) => {
            console.log(value);
            setQuantity(value);
          }}
          initialValue={1}
          min={1}
        ></InputNumber>
      </div>
      <Button
        className="relative flex w-full items-center justify-center rounded-full mt-6 p-6"
        variant="outline"
        size="lg"
        onClick={() => {
          dispatch(addToCart({ item: product, quantity: quantity }));
          toast({
            title: "Successfully added to cart",
          });
        }}
      >
        <span className="mr-2">Add to cart</span>
        <FontAwesomeIcon
          icon={faCartShopping}
          className="cursor-pointer"
          width={18}
          height={18}
        />
      </Button>
      <Button
        className="relative flex w-full items-center justify-center rounded-full mt-2 p-6"
        variant="default"
        onClick={() => router.push(`/${language}/cart`)}
      >
        <span className="mr-2">Buy now</span>
        <FontAwesomeIcon
          icon={faCartShopping}
          className="text-primary cursor-pointer"
          width={18}
          height={18}
        />
      </Button>
    </div>
  );
};

export default DetailContent;
