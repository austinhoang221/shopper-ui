import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

export interface DummyProductResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface DummyProduct {
  id: number;
  title: string;
  images: string[];
  price: string;
}

export default function Product({ product }: { product: DummyProduct }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <Link href={product.title}>
        <Image
          src={product.images[0]}
          alt={product.title}
          width={200}
          height={200}
          className="w-full h-56 object-contain rounded-lg mb-4"
        />
      </Link>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={product.title}
              className="text-base font-normal hover:underline block truncate"
            >
              {product.title}
            </Link>
          </TooltipTrigger>
          <TooltipContent align="start">{product.title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex items-center justify-between">
        <p className="font-bold">{product.price}$</p>
        <Button size="icon" variant="ghost">
          <FontAwesomeIcon
            icon={faCartShopping}
            className="text-primary cursor-pointer"
            width={18}
            height={18}
          />
        </Button>
      </div>
    </div>
  );
}
