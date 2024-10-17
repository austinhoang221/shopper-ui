"use client";
import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "./card";
type Props = {
  defaultAlt: string;
  defaultSrc: string;
  images: string[];
};

const ImageGallery = (props: Props) => {
  const [src, setSrc] = React.useState<string>(props.defaultSrc);
  const [alt, setAlt] = React.useState<string>(props.defaultAlt);
  const onViewImage = (url: string, alt: string) => {
    setSrc(url);
    setAlt(alt);
  };
  return (
    <div className="mx-auto">
      <Image width={500} height={500} alt={alt} src={src} className="mx-auto" />
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm mx-auto mt-4"
      >
        <CarouselContent>
          {props.images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                <Card
                  onClick={() => onViewImage?.(image, index.toString())}
                  className="cursor-pointer"
                >
                  <CardContent className="flex aspect-square items-center justify-center p-0">
                    <Image
                      width={500}
                      height={500}
                      className="w-full h-full object-cover max-w-full max-h-full"
                      src={image}
                      alt="Your alt text"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ImageGallery;
