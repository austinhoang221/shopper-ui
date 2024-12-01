import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import EmptyCart from "@/public/imgs/empty-cart.png";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";

import { Skeleton } from "../ui/skeleton";
import { useAppSelector } from "../hooks/redux";
import { useUtils } from "@/hooks/use-utils";

export default function CartDetail() {
  // const [checkAll, setCheckAll] = React.useState(true);
  const location = usePathname();
  const { cartItems, isLoading } = useAppSelector((state) => state.cart);
  const language = location.split("/")[1];
  const { calculateTotalCart } = useUtils();

  // const onRemoveFromCart = async (id: string) => {
  //   setIsLoadingDeleteBtn(true);
  //   const cartItem = new RemoveCartItemRequest({
  //     productId: id,
  //   });
  //   try {
  //     await service.client.cartsDELETE(userId, cartItem);
  //     toast({
  //       title: "Successfully delete from cart",
  //     });
  //     const index = cart?.findIndex(item => item.productId === id);
  //   } catch (error) {
  //     console.log("Failed to remove item to cart");
  //   }
  //   setIsLoadingDeleteBtn(false);
  // };

  // const onCheckAll = (checked: boolean | string) => {
  //   // dispatch(toggleCheckAll(!!checked));
  //   setCheckAll((prev) => !prev);
  // };

  // const onChangeSelectOption = (key: string, checked: boolean | string) => {
  //   // dispatch(toggle({ id: key, select: !!checked }));
  //   setCheckAll(!!checked);
  // };
  return (
    <div>
      {!isLoading && (
        <>
          {cartItems?.length ?? 0 > 0 ? (
            <>
              <ScrollArea className="max-h-[25rem] gap-4">
                {cartItems?.map((cartItem) => {
                  return (
                    <div
                      className="flex gap-4 flex-1 overflow-hidden"
                      key={cartItem?.productId}
                    >
                      {/* <Checkbox
                    checked={!!cartItem.productId}
                    onCheckedChange={(checked) =>
                      onChangeSelectOption(
                        cartItem.productId?.toString() ?? "",
                        checked
                      )
                    }
                  ></Checkbox> */}
                      <div className="aspect-square w-20 block">
                        <Image
                          src={cartItem?.pictureUrl ?? ""}
                          alt={cartItem?.productName ?? ""}
                          width={96}
                          height={96}
                          className="object-cover h-20 w-full block rounded-lg mb-4 min-w-20"
                        />
                      </div>
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex gap-4 justify-between items-center">
                                {cartItem?.productName ?? ""}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent align="start">
                              {cartItem?.productName ?? ""}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <div className="flex justify-between items-center">
                          <span className="text-center flex">
                            <span>{cartItem?.quantity} x </span>
                            <p className="font-bold text-primary ml-1">
                              {cartItem?.unitPrice}$
                            </p>
                          </span>
                          {/* <Button
                            size="icon"
                            variant="ghost"
                            disabled={isLoadingDeleteBtn}
                            onClick={() =>
                              onRemoveFromCart(
                                cartItem?.productId?.toString() ?? ""
                              )
                            }
                          >
                            <FontAwesomeIcon
                              icon={faTrashCan}
                              className="text-destructive cursor-pointer"
                              width={18}
                              height={18}
                            />
                          </Button> */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>
              <Separator className="bg-[#d5dbdb]" />
              <div className="flex justify-between items-center my-4">
                {/* <div className="flex justify-between items-center space-x-2">
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
            </div> */}
                <span>
                  Total:{" "}
                  <span className="text-lg font-bold text-primary">
                    {calculateTotalCart}$
                  </span>
                </span>
              </div>
              <Link className="w-full" href={`/${language}/cart`}>
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
        </>
      )}
      {isLoading &&
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex gap-4 flex-1 overflow-hidden mb-2">
            <Skeleton className="rounded-lg bg-gray-200 aspect-square w-24" />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Skeleton className="h-4 w-3/4 bg-gray-200 mb-2" />
              <Skeleton className="h-4 w-[5rem] bg-gray-200" />
            </div>
          </div>
        ))}
    </div>
  );
}
