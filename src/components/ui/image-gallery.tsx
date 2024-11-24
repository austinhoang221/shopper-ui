"use client";
import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "./card";
import { GetProductChildResponse } from "@/app/api/services/api";
type Props = {
  defaultAlt: string;
  defaultSrc: string;
  products: GetProductChildResponse[];
};

interface DetailProduct extends GetProductChildResponse {
  imageUrl: string;
}

const ImageGallery = (props: Props) => {
  const [src, setSrc] = React.useState<string>(props.defaultSrc);
  const [alt, setAlt] = React.useState<string>(props.defaultAlt);
  const onViewImage = (url: string, alt: string) => {
    setSrc(url);
    setAlt(alt);
  };
  return (
    <div className="mx-auto w-full">
      <div className="w-full relative pt-[100%]">
        <Image
          src={src}
          alt={alt}
          objectFit="cover"
          fill
          className="w-full h-full top-0 left-0 object-cover"
        />
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm mx-auto mt-4"
      >
        <CarouselContent>
          {props.products?.reduce((acc: A[], child) => {
            const flat =
              child.attachments?.map(
                (attach) =>
                  ({ ...child, imageUrl: attach.link } as DetailProduct)
              ) || [];
            return acc.concat(flat);
          }, []) ??
            [].map((product: DetailProduct, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                <div className="p-1">
                  <Card
                    onClick={() =>
                      onViewImage?.(product.imageUrl, product.name ?? "")
                    }
                    className="cursor-pointer"
                  >
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                      <Image
                        width={500}
                        height={500}
                        className="w-full h-full object-cover max-w-full max-h-full"
                        src={product.imageUrl}
                        alt="Your alt text"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    </div>
  );
};

export default ImageGallery;
