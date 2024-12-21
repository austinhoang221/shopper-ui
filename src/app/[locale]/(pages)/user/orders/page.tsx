"use client";
import { OrderItemResponse, OrderResponse } from "@/app/api/services/api";
import { service } from "@/app/api/services/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

import withAuth from "@/hoc/Auth";
import { AnimatePresence, motion } from "framer-motion";
import { Ellipsis } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import Empty from "../../category/[category]/Empty";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const Orders = () => {
  const { status } = useSession();
  const [orders, setOrders] = React.useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await service.client.ordersAll();
    setOrders(response);
    setIsLoading(false);
  };

  const calculateTotal = (orders: OrderResponse) => {
    return orders.orderItems?.reduce(
      (total: number, order: OrderItemResponse) => {
        return total + (order.unitPrice ?? 0);
      },
      0
    );
  };

  return (
    <>
      {status === "loading" || isLoading ? (
        <AnimatePresence>
          <motion.div
            exit={{ opacity: 0, y: 15 }}
            className="text-center flex items-center"
          >
            <Ellipsis className=" h-12 w-12 mx-auto animate-pulse text-primary" />
          </motion.div>
        </AnimatePresence>
      ) : (
        <>
          {orders?.length === 0 ? (
            <Empty />
          ) : (
            <>
              {orders?.map((order, index) => {
                return (
                  <Card key={order.orderCd} className="mb-2">
                    <CardHeader className="bg-muted">
                      <div className="flex gap-4 justify-between">
                        <div className="flex gap-4 ">
                          <div className="flex-col flex">
                            <div>Order placed</div>
                            <div className="font-semibold">Today</div>
                          </div>
                          <div className="flex-col flex">
                            <div>Total</div>
                            <div className="font-semibold">
                              {calculateTotal(order)}
                            </div>
                          </div>
                          <div className="flex-col flex">
                            <div>Ship to</div>
                            <div className="font-semibold">
                              {order.region},{order.city}
                            </div>
                          </div>
                        </div>
                        <div>Order# {order.orderCd}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {order.orderItems?.map((cartItem) => {
                        return (
                          <>
                            <div
                              className="flex gap-4 flex-1 overflow-hidden mt-2 justify-between"
                              key={cartItem?.productId}
                            >
                              <div className="flex gap-4">
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
                                  <div className="flex gap-4 justify-between items-center">
                                    {cartItem?.productName ?? ""}
                                  </div>
                                  <div>x{cartItem.units}</div>
                                </div>
                              </div>
                              <div className="text-primary">
                                {cartItem.unitPrice}
                              </div>
                            </div>
                            <Separator className="h-[1px] bg-muted" />
                          </>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </>
          )}
        </>
      )}
    </>
  );
};

export default withAuth(Orders);
