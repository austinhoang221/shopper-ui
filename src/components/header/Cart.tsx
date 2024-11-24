"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CartDetail from "./CartDetail";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { service } from "@/app/api/services/service";
import { userIdCookie } from "@/utils/constants";
import { getCookie } from "cookies-next";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { updateCart } from "@/app/store/cartSlice";
import { GetByUserIdItemResponse } from "@/app/api/services/api";

const Cart = () => {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const [openPopover, setOpenPopover] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [cartData, setCartData] = useState<GetByUserIdItemResponse[]>([]);
  const userId = getCookie(userIdCookie);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpenPopover(false);
      } else {
        setOpenDrawer(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await service.client.cartsGET(userId);
      setCartData(data?.items ?? []);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    dispatch(updateCart(cartData));
  }, [cartData]);

  return (
    <>
      <div className="hidden md:block relative">
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="relative ">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-primary cursor-pointer"
                width={25}
                height={25}
              />
              {/* <span className="ml-1 ">{cartItems?.length}</span> */}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[25rem] ">
            <CartDetail />
          </PopoverContent>
        </Popover>
        <div className="absolute rounded-full px-1 -right-2 -top-2 min-w-5 text-center border border-white text-white bg-primary">
          {cartItems?.length}
        </div>
      </div>
      <div className="block md:hidden relative">
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerTrigger asChild>
            <Button size="icon" variant="ghost" className="relative ">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-primary cursor-pointer"
                width={20}
                height={20}
              />
              {/* <span className="ml-1 ">{cartItems?.length}</span> */}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-white">
            <DrawerHeader>
              <DrawerTitle></DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <CartDetail />
            </div>
          </DrawerContent>
        </Drawer>
        <div className="absolute rounded-full px-1 -right-2 -top-2 min-w-5 text-center border border-white text-white bg-primary">
          {cartItems?.length}
        </div>
      </div>
    </>
  );
};

export default Cart;
