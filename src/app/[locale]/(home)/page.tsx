import React from "react";
import HomeCarousel from "@/components/carousel/HomeCarousel";
import ListCategory from "./ListCategory";
import PrallaxCarousel from "@/components/carousel/ParallaxCarousel";
import LayoutProvider from "@/app/LayoutProvider";
import { service } from "@/api/services/service";
import UpdateBreadcrumb from "@/components/header/UpdateBreadcrumb";

const Home = async ({ params: { locale } }) => {
  const bestSellers = await service.client.bestSellers(6);
  const flat = bestSellers?.flatMap((item) => item.attachments);
  return (
    <LayoutProvider>
      <UpdateBreadcrumb items={[]} />

      <HomeCarousel />
      <ListCategory language={locale} />
      <h1 className="text-center text-bolder text-2xl my-16">
        Best Seller in Fashion
      </h1>
      <PrallaxCarousel images={flat.map((image) => image?.link ?? "")} />
      <h1 className="text-center text-bolder text-2xl my-16">Spotlight</h1>
      {/* <ListProduct  isInfiniteScroll={false} /> */}
    </LayoutProvider>
  );
};

export default Home;
