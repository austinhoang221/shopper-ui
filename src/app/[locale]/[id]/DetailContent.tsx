"use client";
import {
  GetByAttributeDetailIdsRequest,
  GetByAttributeDetailIdsResponse,
  GetProductAttributeDetailResponse,
  GetProductChildResponse,
  GetProductResponse,
  ProductOffsetPageStaticResponse,
} from "@/api/services/api";
import { service } from "@/api/services/service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageGallery from "@/components/ui/image-gallery";
import InputNumber from "@/components/ui/input-number";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "next/navigation";
import React from "react";

type Props = {
  product: GetProductResponse;
};
interface ProductAttribute {
  id: string;
  label: string;
  value: string;
}

const DetailContent = (props: Props) => {
  const { product } = props;
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const language = params.locale;
  const [quantity, setQuantity] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [detailProduct, setDetailProduct] = React.useState<
    GetByAttributeDetailIdsResponse | undefined
  >();
  const initialValue = product?.attributes?.reduce(
    (acc: ProductAttribute[], attr) => {
      const flat: ProductAttribute[] = [];
      const set = new Set();
      attr.attributeDetails?.map((detail) => {
        if (!set.has(attr.attributeName)) {
          flat.push({
            id: detail.id ?? "",
            label: attr.attributeName ?? "",
            value: detail.value ?? "",
          });
          set.add(attr.attributeName);
        }
      }) ?? [];
      acc.push(...flat);
      return [...new Set(acc)];
    },
    []
  );
  const [selectedAttributes, setSelectedAttributes] = React.useState<
    ProductAttribute[]
  >(initialValue ?? []);

  const fetchDetailProduct = React.useCallback(async () => {
    setIsLoading(true);
    const model = GetByAttributeDetailIdsRequest.fromJS({
      attributeDetailIds: selectedAttributes?.map((value) => value.id),
    });
    const data = await service.client.attributeDetail(model);
    setDetailProduct(data);
    setIsLoading(false);
  }, [selectedAttributes]);

  React.useEffect(() => {
    fetchDetailProduct();
  }, [fetchDetailProduct, selectedAttributes]);

  const onAddToCart = (item: ProductOffsetPageStaticResponse) => {
    toast({
      title: "Successfully added to cart",
    });
  };

  const handleAttributeClick = async (
    id: string,
    parent: string,
    value: string
  ) => {
    if (isAttributeSelected(id)) return;
    const newValue = selectedAttributes.map((selected) => {
      if (selected.label === parent)
        return {
          id: id,
          label: selected.label,
          value: value,
        };
      else return selected;
    });
    setQuantity(1);
    setSelectedAttributes(newValue);
  };

  const isAttributeSelected = (id: string) => {
    return !!selectedAttributes.find((attr) => attr.id === id);
  };

  const onRenderAttributes = () => {
    return product?.attributes?.map((attr) => {
      return (
        <div className="flex items-center justify-between mb-2" key={attr.id}>
          <span className="text-muted-foreground">{attr.attributeName}</span>
          <div className="flex gap-2">
            {attr?.attributeDetails?.map((detail) => (
              <Button
                disabled={isLoading}
                key={detail.id}
                variant={
                  isAttributeSelected(detail.id ?? "") ? "default" : "outline"
                }
                onClick={() => {
                  handleAttributeClick(
                    detail.id ?? "",
                    attr.attributeName ?? "",
                    detail.value ?? ""
                  );
                }}
              >
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
        {/* <ImageGallery
          products={product.children ?? []}
          defaultAlt={product.i18nName ?? ""}
          defaultSrc={product.children?.[0]?.attachments?.[0]?.link ?? ""}
        /> */}
        <div>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-2/3 bg-gray-200" />
              <div className="text-muted-foreground text-xs mb-2 mt-2">
                <span className="flex">
                  SKU: <Skeleton className="h-4 w-[10rem] bg-gray-200" />
                </span>
              </div>

              <h1 className="text-xl text-primary font-bold p-4 bg-muted mb-2">
                <Skeleton className="h-6 w-[10rem] bg-gray-200" />
              </h1>

              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Unit</span>
                <Skeleton className="h-4 w-[2.5rem] bg-gray-200" />
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Weight</span>
                <Skeleton className="h-4 w-[2.5rem] bg-gray-200" />
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">In stock</span>
                <Skeleton className="h-4 w-[2.5rem] bg-gray-200" />
              </div>
            </>
          ) : (
            <div>
              <h1 className="text-xl font-medium ">{detailProduct?.name}</h1>

              <div className="text-muted-foreground text-xs mb-2">
                <span>SKU: {detailProduct?.productCd}</span>
              </div>
              <h1 className="text-xl text-primary font-bold p-4 bg-muted mb-2">
                {detailProduct?.sellingPrice}$
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
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Quantity</span>
              <InputNumber
                disabled={isLoading}
                onChange={(value) => {
                  setQuantity(value);
                }}
                initialValue={1}
                min={1}
              ></InputNumber>
            </div>
            {onRenderAttributes()}
            <Button
              disabled={isLoading}
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
              disabled={isLoading}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailContent;
