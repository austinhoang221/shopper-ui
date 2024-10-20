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
import { useToast } from "../hooks/use-toast";

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
  const { toast } = useToast();
  const onAddToCart = (item: ProductResponse) => {
    dispatch(addToCart({ item: item, quantity: 1 }));
    toast({
      title: "Successfully added to cart",
    });
  };
  const href = `${pathname}/${convertStringToHandle(
    product.name?.toString()
  )}-p.${product.id}`;
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

      <p className="font-bold text-primary">{product.sellingPrice}$</p>
      <Button
        className="w-full mt-2"
        variant="outline"
        onClick={() => onAddToCart(product)}
      >
        <span className="mr-2 text-primary">Add to cart</span>
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
