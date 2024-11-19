"use client";
import { useAppSelector } from "@/components/hooks/redux";
import React from "react";

export const useUtils = () => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const calculateTotalCart = React.useMemo(() => {
    const total = cartItems.reduce((currentValue, product) => {
      return currentValue + product.unitPrice! * product.quantity!;
    }, 0);
    return total.toFixed(2);
  }, [cartItems]);

  return { calculateTotalCart };
};
