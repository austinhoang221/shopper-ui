"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUtils } from "@/hooks/use-utils";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type Props = {};

const ListCart = (props: Props) => {
  const { calculateTotalCart } = useUtils();

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Totals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sub-total</span>
            <span>320$</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span>20$</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>15$</span>
          </div>
          <Separator className="bg-[#d5dbdb] mt-4" />
          <div className="flex justify-between items-center my-4">
            <span>Total: </span>
            <span className="text-lg font-bold">{calculateTotalCart}$</span>
          </div>
          <Button className="w-full bg-tertiary text-tertiary-foreground p-4">
            PROCEED TO CHECKOUT
            <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListCart;
