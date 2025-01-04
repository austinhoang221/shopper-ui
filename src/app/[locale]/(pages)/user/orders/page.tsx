"use client";
import {
  OffsetPage,
  OrderItemResponse,
  OrderOffsetPageStaticQuery,
  OrderOffsetPageStaticResponse,
  OrderResponse,
  OrderStaticFilter,
} from "@/app/api/services/api";
import { service } from "@/app/api/services/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

import withAuth from "@/hoc/Auth";
import { useSession } from "next-auth/react";
import React from "react";
import Empty from "../../category/[category]/Empty";

import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Loading from "@/components/motion/Loading";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { defaultPageSize } from "@/utils/constants";

const Orders = () => {
  const { status } = useSession();
  const page = React.useRef(1);
  const hasMore = React.useRef(true);
  const itemCount = React.useRef(0);
  const [orders, setOrders] = React.useState<OrderOffsetPageStaticResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { data: userData } = useSession();
  React.useEffect(() => {
    page.current = 1;
    setOrders([]);
    itemCount.current = 0;
    hasMore.current = true;
    if (userData?.user?.id) fetchData();
  }, [userData?.user?.id]);

  const fetchData = async () => {
    setIsLoading(true);

    const model = OrderOffsetPageStaticQuery.fromJS({
      filter: OrderStaticFilter.fromJS({ userId: userData?.user?.id }),
      sortBy: "",
      page: OffsetPage.fromJS({
        pageSize: 5,
        pageNumber: page.current,
      }),
    });
    const response = await service.client.offset(model);
    if (itemCount.current + defaultPageSize >= response.totalItemsCount!) {
      hasMore.current = false;
    }
    itemCount.current += response.items?.length ?? 0;
    setOrders((prev) => [...prev, ...response.items!]);
    page.current++;
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
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[50vh] ">
        <>
          {orders?.length === 0 && !isLoading ? (
            <Empty />
          ) : (
            <div>
              {orders?.map((order) => {
                return (
                  <Card key={order.orderCd}>
                    <CardHeader className="bg-muted">
                      <div className="flex gap-4 justify-between">
                        <div className="flex gap-4 ">
                          <div className="flex-col flex">
                            <div>Order placed</div>
                            <div className="font-semibold">
                              {order.orderDate!
                                ? format(
                                    order?.orderDate,
                                    "EEEE, MMMM do, yyyy"
                                  )
                                : ""}
                            </div>
                          </div>

                          <div className="flex-col flex">
                            <div>Ship to</div>
                            <div className="font-semibold">
                              {order.detailedAddress}
                            </div>
                          </div>
                        </div>
                        <div>Order# {order.orderCd}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {order.orderItems?.map((cartItem, index) => {
                        return (
                          <div key={cartItem?.productId}>
                            <div className="flex gap-4 flex-1 overflow-hidden mt-2 justify-between">
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
                              <div className="text-primary font-semibold text-md">
                                {cartItem.unitPrice}&euro;
                              </div>
                            </div>
                            <Separator className="h-[1px] bg-muted" />
                            {order?.orderItems &&
                              index === order?.orderItems?.length - 1 && (
                                <div className="flex justify-between">
                                  <div></div>
                                  <div className="my-4">
                                    <span>Total: </span>
                                    <span className="text-lg text-primary font-bold">
                                      {calculateTotal(order)?.toFixed(2)}
                                      &euro;
                                    </span>
                                  </div>
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
        <InfiniteScroll
          hasMore={hasMore.current}
          isLoading={isLoading}
          next={fetchData}
          threshold={1}
        >
          {hasMore.current && (
            <div className="mt-4">
              <Loading />
            </div>
          )}
        </InfiniteScroll>
      </CardContent>
    </Card>
  );
};

export default withAuth(Orders);
