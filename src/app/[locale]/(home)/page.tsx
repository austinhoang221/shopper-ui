import { useTranslation } from "@/app/i18n";

import React from "react";
import HomeCarousel from "@/components/carousel/HomeCarousel";
import ListCategory from "./ListCategory";
import PrallaxCarousel from "@/components/carousel/ParallaxCarousel";
import ListProduct from "@/components/product/ListProduct";

const Home = async ({ params: { locale } }) => {
  const { t } = await useTranslation(locale);

  return (
    <main>
      <HomeCarousel />
      <ListCategory />
      <h1 className="text-center text-bolder text-2xl my-8">
        Best Seller in Fashion
      </h1>
      <PrallaxCarousel />
      <h1 className="text-center text-bolder text-2xl my-8">Spotlight</h1>
      <PrallaxCarousel />
      <ListProduct isInfiniteScroll={false} />
    </main>
  );
};

export default Home;
