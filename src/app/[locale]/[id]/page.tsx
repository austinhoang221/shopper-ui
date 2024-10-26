import ImageGallery from "@/components/ui/image-gallery";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { service } from "@/api/services/service";
import PrallaxCarousel from "@/components/carousel/ParallaxCarousel";
import UpdateBreadcrumb from "@/components/header/UpdateBreadcrumb";
import { IBreadcrumbState } from "@/reduxConfig/breadcrumbSlice";
import DetailContent from "./DetailContent";
import Breadcrumb from "@/components/header/Breadcrumb";
import Product from "@/components/product/Product";
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
    product.memberNames
      ?.slice(0, product.memberNames.length - 1)
      .map((item) => ({
        icon: "",
        href: `category/${item}`,
        name: item,
        key: `k-c-nav-${item}`,
      })) ?? [];
  categoriesBreadcrumb.push({
    icon: "",
    href: `${product.name}`,
    name: product.name ?? "",
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
