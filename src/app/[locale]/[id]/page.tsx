import ImageGallery from "@/components/ui/image-gallery";
import { Separator } from "@/components/ui/separator";
import InputNumber from "@/components/ui/input-number";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { service } from "@/api/services/service";
import PrallaxCarousel from "@/components/carousel/ParallaxCarousel";

export default async function page({ params }) {
  const product = await service.client.products(params.id.split("-p.")?.[1]);

  return (
    <>
      <Card className="mt-4">
        <CardContent className="grid grid-cols-2 gap-4 mt-4">
          <ImageGallery
            images={
              product.attachments?.map((attach) => attach.link ?? "") ?? []
            }
            defaultAlt={product.name ?? ""}
            defaultSrc={
              product.attachments?.map((attach) => attach.link)?.[0] ?? ""
            }
          />
          <div>
            <h1 className="text-xl mb-2">{product.name}</h1>
            <h1 className="text-xl text-primary font-bold p-4 bg-muted mb-2">
              {product.sellingPrice}$
            </h1>

            <Separator className="mt-4 bg-[#d5dbdb]" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground">Sku</span>
              <span>{product.productCd}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground">In stock</span>
              <span>{product.stock}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground">Unit</span>
              <span>{product.unit}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground">Weight</span>
              <span>{product.weight}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Quantity</span>
              <InputNumber initialValue={1} min={1}></InputNumber>
            </div>
            <Button
              className="relative flex w-full items-center justify-center rounded-full mt-6 p-6"
              variant="secondary"
              size="lg"
            >
              <span className="mr-2">Add to cart</span>
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-primary cursor-pointer"
                width={18}
                height={18}
              />
            </Button>
            <Button
              className="relative flex w-full items-center justify-center rounded-full mt-4 p-6"
              variant="outline"
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
      <Card className="mt-4">
        <CardContent>
          <p>{product.txDesc}</p>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardTitle>Similar products</CardTitle>
        <CardContent>
          <PrallaxCarousel />
        </CardContent>
      </Card>
    </>
  );
}
