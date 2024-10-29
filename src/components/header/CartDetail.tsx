import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import { useUtils } from "@/hooks/use-utils";
import EmptyCart from "@/public/imgs/empty-cart.png";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { service } from "@/api/services/service";
import { GetByUserIdResponse, RemoveCartItemRequest } from "@/api/services/api";
import { getCookie } from "cookies-next";
import { userIdCookie } from "@/utils/constants";

export default function CartDetail() {
  const [checkAll, setCheckAll] = React.useState(true);
  const location = usePathname();
  const language = location.split("/")[1];
  // const { calculateTotalCart } = useUtils();
   const [cart, setCart] = React.useState<GetByUserIdResponse | null>(null);

  const onRemoveFromCart = async (id: string) => {
    const cartItem = new RemoveCartItemRequest ({
      productId: id,
    });
    try {
      const userId = getCookie(userIdCookie);
      await service.client.cartsDELETE(userId, cartItem);
    } catch (error) {
      console.log("Failed to remove item to cart");
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const userId = getCookie(userIdCookie);
      console.log(userId)
      const data = await service.client.cartsGET(userId);
      setCart(data);
    };

    fetchData();
  }, []);

  const onCheckAll = (checked: boolean | string) => {
    // dispatch(toggleCheckAll(!!checked));
    setCheckAll((prev) => !prev);
  };

  const onChangeSelectOption = (key: string, checked: boolean | string) => {
    // dispatch(toggle({ id: key, select: !!checked }));
    setCheckAll(!!checked);
  };
  return (
    <div>
      {cart?.items?.length ?? 0 > 0 ? (
        <>
          <ScrollArea className="max-h-[25rem] gap-4">
            {cart?.items?.map((cartItem) => {
              return (
                <div
                  className="flex gap-4 flex-1 overflow-hidden"
                  key={cartItem?.productId}
                >
                  <Checkbox
                    checked={!!cartItem.productId}
                    onCheckedChange={(checked) =>
                      onChangeSelectOption(
                        cartItem.productId?.toString() ?? "",
                        checked
                      )
                    }
                  ></Checkbox>
                  <Link
                    href={cartItem?.productName ?? ""}
                    className="aspect-square w-24 block"
                  >
                    <Image
                      src={cartItem?.pictureUrl ?? ""}
                      alt={cartItem?.productName ?? ""}
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
                              href={cartItem?.productName ?? ""}
                              className="font-normal hover:underline  block text-sm flex-1 truncate"
                            >
                              {cartItem?.productName ?? ""}
                            </Link>
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
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          onRemoveFromCart(cartItem?.productId?.toString() ?? "")
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
          </ScrollArea>
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
              {/* <span className="text-lg font-bold text-primary">
                {calculateTotalCart}$
              </span> */}
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
    </div>
  );
}
