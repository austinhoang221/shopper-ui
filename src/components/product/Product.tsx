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
import { convertStringToHandle } from "@/utils/utils";
import { usePathname } from "next/navigation";
import { ProductResponse } from "@/api/services/client";

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
  sku: string;
  description: string;
  price: number;
  availabilityStatus: string;
}

export default function Product({ product }: { product: ProductResponse }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const path = pathname.split("/").slice(0, 2).join("/");
  console.log(
    `${path}/${convertStringToHandle(product.name)}-id.${product.id}`
  );
  const onAddToCart = (item: ProductResponse) => {
    dispatch(addToCart(item));
  };
  const href = `${path}/${convertStringToHandle(product.name?.toString())}-p.${
    product.id
  }`;
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <Link href={href}>
        <Image
          src={product.attachments?.[0]?.link ?? ""}
          alt={product.name ?? ""}
          width={200}
          height={200}
          className="w-full h-56 object-contain rounded-lg mb-4"
        />
      </Link>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className="text-base font-normal hover:underline block truncate"
            >
              {product.name}
            </Link>
          </TooltipTrigger>
          <TooltipContent align="start">{product.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <p className="font-bold">{product.sellingPrice}$</p>
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
