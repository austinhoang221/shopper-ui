"use client";
import React from "react";

export const useUtils = () => {
  const calculateTotalCart = React.useMemo(() => {
    const total = cartItems.reduce((currentValue, product) => {
      if (product.select)
        return currentValue + product.item.sellingPrice! * product.quantity;
      else return currentValue;
    }, 0);
    return total.toFixed(2);
  }, [cartItems]);

  return { calculateTotalCart };
};
