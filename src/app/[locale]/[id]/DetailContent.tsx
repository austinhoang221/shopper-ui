"use client";
import {
  GetProductChildResponse,
  GetProductResponse,
  ProductOffsetPageStaticResponse,
} from "@/api/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageGallery from "@/components/ui/image-gallery";
import InputNumber from "@/components/ui/input-number";
import { useToast } from "@/hooks/use-toast";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ProductOffsetPageStaticResponse } from "@/api/services/api";

type Props = {
  product: GetProductResponse;
};

const DetailContent = (props: Props) => {
  const { product } = props;
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const language = params.locale;
  const [quantity, setQuantity] = React.useState(1);
  const [detailProduct, setDetailProduct] = React.useState<
    GetProductChildResponse | undefined
  >(product?.children?.[0]);

  const onAddToCart = (item: ProductOffsetPageStaticResponse) => {
    toast({
      title: "Successfully added to cart",
    });
  };

  const onRenderAttributes = () => {
    return product?.attributes?.map((attr) => {
      return (
        <div className="flex items-center justify-between mb-2" key={attr.id}>
          <span className="text-muted-foreground">{attr.attributeName}</span>
          <div className="flex gap-2">
            {attr.attributeDetails?.map((detail) => (
              <Button key={detail.id} variant="outline">
                {detail.value}
              </Button>
            ))}
          </div>
        </div>
      );
    });
  };
  return (
    <Card className="mt-4">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <ImageGallery
          products={product.children ?? []}
          defaultAlt={product.i18nName ?? ""}
          defaultSrc={product.children?.[0]?.attachments?.[0]?.link ?? ""}
        />
        <div>
          <h1 className="text-xl font-medium ">{product.name}</h1>
          <div className="text-muted-foreground text-xs mb-2">
            <span>SKU: {detailProduct?.productCd}</span>
          </div>
          <h1 className="text-xl text-primary font-bold p-4 bg-muted mb-2">
            {product.sellingPrice}$
          </h1>

          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Unit</span>
            <span>{product?.unit}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Weight</span>
            <span>{product?.weight} gram</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">In stock</span>
            <span>{detailProduct?.stock}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Quantity</span>
            <InputNumber
              onChange={(value) => {
                setQuantity(value);
              }}
              initialValue={1}
              min={1}
            ></InputNumber>
          </div>
          {onRenderAttributes()}
          <Button
            className="relative flex w-full items-center justify-center rounded-full mt-6 p-6"
            variant="outline"
            size="lg"
            onClick={() => onAddToCart(product)}
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
      </CardContent>
    </Card>
  );
};

export default DetailContent;
