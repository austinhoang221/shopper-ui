import React, { Suspense } from "react";
import HomeCarousel from "@/components/carousel/HomeCarousel";
import { ListCategory } from "./ListCategory";
import PrallaxCarousel from "@/components/carousel/ParallaxCarousel";
import LayoutProvider from "@/app/LayoutProvider";
import { service } from "@/app/api/services/service";
import { auth } from "@/auth";

const Home: React.FC<A> = async ({ params: { locale } }) => {
  const bestSellers = await service.client.bestSellers2(6);
  const flat = bestSellers?.flatMap((item) => item.attachments);
  const session = await auth();
  console.log(session);
  return (
    <LayoutProvider>
      <HomeCarousel />
      <Suspense fallback={<p>Loading feed...</p>}>
        <ListCategory language={locale} />
      </Suspense>
      <h1 className="text-center text-bolder text-2xl my-16">
        Best Seller in Fashion
      </h1>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PrallaxCarousel images={flat.map((image) => image?.link ?? "")} />
      </Suspense>

      <h1 className="text-center text-bolder text-2xl my-16">Spotlight</h1>
      {/* <ListProduct  isInfiniteScroll={false} /> */}
    </LayoutProvider>
  );
};

export default Home;
