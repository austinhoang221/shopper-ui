import ImageGallery from "@/components/ui/image-gallery";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { service } from "@/app/api/services/service";
import PrallaxCarousel from "@/components/carousel/ParallaxCarousel";

import DetailContent from "./DetailContent";
import Breadcrumb, { IBreadcrumbState } from "@/components/header/Breadcrumb";
import Product from "@/components/product/Product";
import { convertStringToHandle } from "@/utils/utils";
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await service.client.products(params.id.split("-p.")?.[1]);
  return {
    title: product.name,
  };
}

export default async function ProductDetail({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const product = await service.client.products(params.id.split("-p.")?.[1]);

  const categoriesBreadcrumb =
    product.members?.slice(0, product.members.length - 1).map((item) => {
      const href = `category/${convertStringToHandle(
        item.name
      )}-cat.${item.id?.toString()}`;
      return {
        icon: "",
        href: href,
        name: item.name ?? "",
        key: `k-c-nav-${item.id}`,
      };
    }) ?? [];
  categoriesBreadcrumb.push({
    icon: "",
    href: `${product.name}`,
    name: product.i18nName ?? "",
    key: `k-c-nav-${product.i18nName}`,
  });
  const items: IBreadcrumbState[] = [...categoriesBreadcrumb];

  return (
    <>
      <Breadcrumb language="en" breadcrumbs={items} />
      <DetailContent product={JSON.parse(JSON.stringify(product))} />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Product description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{product.i18nTxDesc}</p>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Similar products</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <PrallaxCarousel
            images={
              product.attachments?.map((attach) => attach.link ?? "") ?? []
            }
          /> */}
        </CardContent>
      </Card>
    </>
  );
}
