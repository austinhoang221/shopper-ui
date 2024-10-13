"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/hooks/reduxHooks";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CartDetail from "./CartDetail";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "../ui/drawer";
import useMediaQuery from "../ui/usemedia";

const Cart = () => {
  const { cartItems } = useAppSelector((state) => state.cart);
  
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  useEffect(() => {
    if (isDesktop) {
      setOpenDrawer(false);
    }
  }, [isDesktop]);

  return (
    <>
      <div className="hidden md:block">
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
            <CartDetail />
          </PopoverContent>
        </Popover>
      </div>
      <div className="block md:hidden">
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerTrigger asChild>
            <Button size="icon" variant="ghost" className="relative ">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-primary cursor-pointer"
                width={20}
                height={20}
              />
              <span className="ml-1 ">{cartItems?.length}</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-white">
            <div className="px-4">
              <CartDetail />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

export default Cart;
