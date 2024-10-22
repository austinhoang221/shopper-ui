import ImageGallery from "@/components/ui/image-gallery";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { service } from "@/api/services/service";
import PrallaxCarousel from "@/components/carousel/ParallaxCarousel";
import UpdateBreadcrumb from "@/components/header/UpdateBreadcrumb";
import { IBreadcrumbState } from "@/reduxConfig/breadcrumbSlice";
import DetailContent from "./DetailContent";
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await service.client.products(params.id.split("-p.")?.[1]);
  console.log(product);
  return {
    title: product.name,
  };
}
export default async function ProductDetail({
  params,
}: {
  params: { category: string; id: string };
}) {
  const product = await service.client.products(params.id.split("-p.")?.[1]);
  const items: IBreadcrumbState[] = [
    {
      icon: "",
      href: `category/${params.category}`,
      name: params.category.split("-cat.")?.[0],
      key: `k-c-nav-${params.category}`,
    },
    {
      icon: "",
      href: `${product.name}`,
      name: product.name ?? "",
      key: `k-c-nav-${product.name}`,
    },
  ];
  return (
    <>
      <UpdateBreadcrumb items={items} />
      <Card className="mt-4">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <ImageGallery
            images={
              product.attachments?.map((attach) => attach.link ?? "") ?? []
            }
            defaultAlt={product.name ?? ""}
            defaultSrc={
              product.attachments?.map((attach) => attach.link)?.[0] ?? ""
            }
          />
          <DetailContent product={JSON.parse(JSON.stringify(product))} />
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Product description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{product.txDesc}</p>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Similar products</CardTitle>
        </CardHeader>
        <CardContent>
          <PrallaxCarousel
            images={
              product.attachments?.map((attach) => attach.link ?? "") ?? []
            }
          />
        </CardContent>
      </Card>
    </>
  );
}
