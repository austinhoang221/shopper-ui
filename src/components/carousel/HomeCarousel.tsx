"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";

const HomeCarousel = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  return (
    <Carousel
      className="w-full border-none"
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="w-full relative max-h-[350px]">
            <AspectRatio ratio={16 / 9}>
              <Image
                fill
                className="h-full w-full rounded-md object-cover"
                src={`https://picsum.photos/600/350?v=${index}`}
                priority
                alt="Your alt text"
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselDots />
    </Carousel>
  );
};

export default HomeCarousel;
