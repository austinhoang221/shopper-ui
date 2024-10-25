import ImageGallery from "@/components/ui/image-gallery";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { service } from "@/api/services/service";
import PrallaxCarousel from "@/components/carousel/ParallaxCarousel";
import UpdateBreadcrumb from "@/components/header/UpdateBreadcrumb";
import { IBreadcrumbState } from "@/reduxConfig/breadcrumbSlice";
import DetailContent from "./DetailContent";
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await service.client.products(params.id.split("-p.")?.[1]);
  return {
    title: product.name,
  };
}

export default async function ProductDetail({
  params,
}: Readonly<{
  params: { category: string; id: string };
}>) {
  const product = await service.client.products(params.id.split("-p.")?.[1]);
  console.log(product);
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
      <UpdateBreadcrumb items={items} />
      <Card className="mt-4">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <ImageGallery
            images={
              product.children?.reduce((acc: string[], child) => {
                const flat =
                  child.attachments?.map((attach) => attach.link ?? "") || [];
                return acc.concat(flat);
              }, []) ?? []
            }
            defaultAlt={product.i18nName ?? ""}
            defaultSrc={product.children?.[0]?.attachments?.[0]?.link ?? ""}
          />
          <DetailContent product={JSON.parse(JSON.stringify(product))} />
        </CardContent>
      </Card>
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
