"use client";
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
import { useAppDispatch } from "@/hooks/reduxHooks";
import { addToCart } from "@/reduxConfig/cartSlice";
import { usePathname } from "next/navigation";

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
  price: number;
}

export default function Product({ product }: { product: DummyProduct }) {
  const dispatch = useAppDispatch();
  const paths = usePathname();
  const pathNames = paths
    .split("/")
    .filter((path) => path)
    .join("/");
  const onAddToCart = (item: DummyProduct) => {
    dispatch(addToCart(item));
  };
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <Link href={`/${pathNames}/${product.title}`}>
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
              href={`${pathNames}/${product.title}`}
              className="text-base font-normal hover:underline block truncate"
            >
              {product.title}
            </Link>
          </TooltipTrigger>
          <TooltipContent align="start">{product.title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <p className="font-bold">{product.price}$</p>
      <Button
        className="w-full mt-2"
        variant="secondary"
        onClick={() => onAddToCart(product)}
      >
        <span className="mr-2">Add to cart</span>
        <FontAwesomeIcon
          icon={faCartShopping}
          className="text-primary cursor-pointer"
          width={18}
          height={18}
        />
      </Button>
    </div>
  );
}
