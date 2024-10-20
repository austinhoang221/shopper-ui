"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/hooks/reduxHooks";
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

const Cart = () => {
  const { cartItems } = useAppSelector((state) => state.cart);

  const [openPopover, setOpenPopover] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

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

  return (
    <>
      <div className="hidden md:block">
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
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
            <DrawerHeader>
              <DrawerTitle>
                <span className="text-primary">Shopping Cart</span>
              </DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <CartDetail />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

export default Cart;
