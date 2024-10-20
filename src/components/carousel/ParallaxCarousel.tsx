"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import "./ParallaxCarousel.scss";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

type Props = {
  images: string[];
};

const PrallaxCarousel = (props: Props) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  return (
    <Carousel
      className="w-full my-4"
      plugins={[plugin.current]}
      opts={{ loop: true, dragFree: true }}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="ml-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="embla__slide basis-full md:basis-1/4"
          >
            <div className="embla__parallax">
              <div className="embla__parallax__layer">
                <Image
                  width={500}
                  height={500}
                  className="embla__slide__img embla__parallax__img"
                  src={`https://picsum.photos/600/350?v=${index}`}
                  alt="Your alt text"
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselDots />
    </Carousel>
  );
};

export default PrallaxCarousel;
