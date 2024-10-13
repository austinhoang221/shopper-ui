"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import {
  removeFromCart,
  toggle,
  toggleCheckAll,
} from "@/reduxConfig/cartSlice";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import EmptyCart from "@/public/imgs/empty-cart.png";
import { usePathname } from "next/navigation";
import { useUtils } from "@/hooks/use-utils";

type Props = {};

const Cart = (props: Props) => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const [checkAll, setCheckAll] = React.useState(true);
  const dispatch = useAppDispatch();
  const location = usePathname();
  const { calculateTotalCart } = useUtils();
  const onRemoveFromCart = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const onCheckAll = (checked: boolean | string) => {
    dispatch(toggleCheckAll(!!checked));
    setCheckAll((prev) => !prev);
  };

  const onChangeSelectOption = (key: string, checked: boolean | string) => {
    dispatch(toggle({ id: key, select: !!checked }));
    setCheckAll(!!checked);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="relative ">
          <FontAwesomeIcon
            icon={faCartShopping}
            className="text-primary cursor-pointer"
            width={20}
            height={20}
          />
          <span className="ml-1 ">{cartItems?.length}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[25rem] ">
        {cartItems.length > 0 ? (
          <>
            <div className="max-h-[25rem] gap-4 overflow-y-scroll overflow-x-hidden">
              {cartItems.map((cartItem) => {
                return (
                  <div
                    className="flex gap-4 flex-1 overflow-hidden"
                    key={cartItem.item.id}
                  >
                    <Checkbox
                      checked={cartItem.select}
                      onCheckedChange={(checked) =>
                        onChangeSelectOption(
                          cartItem.item.id.toString(),
                          checked
                        )
                      }
                    ></Checkbox>
                    <Link
                      href={cartItem.item.title}
                      className="aspect-square w-24 block"
                    >
                      <Image
                        src={cartItem.item.images[0]}
                        alt={cartItem.item.title}
                        width={96}
                        height={96}
                        className="object-cover w-full block rounded-lg mb-4 min-w-24"
                      />
                    </Link>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex gap-4 justify-between items-center">
                              <Link
                                href={cartItem.item.title}
                                className="font-normal hover:underline  block text-sm flex-1 truncate"
                              >
                                {cartItem.item.title}
                              </Link>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent align="start">
                            {cartItem.item.title}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <div className="flex justify-between items-center">
                        <span className="text-center flex">
                          <span>{cartItem.quantity} x </span>
                          <p className="font-bold ml-1">
                            {cartItem.item.price}$
                          </p>
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            onRemoveFromCart(cartItem.item.id.toString())
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="text-destructive cursor-pointer"
                            width={18}
                            height={18}
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Separator className="bg-[#d5dbdb]" />
            <div className="flex justify-between items-center my-4">
              <div className="flex justify-between items-center space-x-2">
                <Checkbox
                  id="all"
                  checked={checkAll}
                  onCheckedChange={(checked) => onCheckAll(checked)}
                />
                <label
                  htmlFor="all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  All
                </label>
              </div>
              <span>
                Total:{" "}
                <span className="text-lg font-bold">{calculateTotalCart}$</span>
              </span>
            </div>
            <Link className="w-full" href={`${location}/cart`}>
              <Button className="w-full">View cart</Button>
            </Link>
          </>
        ) : (
          <div className="h-[18rem] text-center font-bold flex flex-col justify-center items-center">
            <div className="mb-6 rounded-full text-lg w-[12rem] h-[12rem] mx-auto bg-[#f4f3f1] p-4 ">
              <Image
                src={EmptyCart}
                alt="Empty cart"
                width={200}
                height={200}
                className=" mx-auto"
              />
            </div>
            <span>Your cart is empty</span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Cart;
