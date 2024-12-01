"use client";
import {
  GetByUserIdItemResponse,
  RemoveCartItemRequest,
} from "@/app/api/services/api";
import { service } from "@/app/api/services/service";
import { removeFromCart, updateQuantity } from "@/app/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/components/hooks/redux";
import { toast } from "@/components/hooks/use-toast";
import { OrderSummary } from "@/components/order-summary/OrderSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputNumber from "@/components/ui/input-number";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userIdCookie } from "@/utils/constants";
import debounce from "lodash.debounce";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { IconButton } from "@/components/ui/icon-button";
import { ArrowRightIcon } from "lucide-react";

const ListCart = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const userId = getCookie(userIdCookie);

  const [isLoadingDeleteBtn, setIsLoadingDeleteBtn] =
    React.useState<boolean>(false);

  const columns: ColumnDef<GetByUserIdItemResponse>[] = [
    {
      accessorKey: "products",
      header: "Products",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "action",
      header: "",
    },
  ];
  const table = useReactTable({
    data: cartItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const goToCheckOut = () => {
    router.push("cart/checkout");
  };

  const debouncedUpdate = debounce((dispatch, id, value) => {
    dispatch(updateQuantity({ productId: id, quantity: value }));
  }, 500);

  const onChangeQuantity = (id: string, value: number) => {
    callBackQuantity(id, value);
  };

  const callBackQuantity = React.useCallback(
    (id: string, value: number) => {
      // Use the debounced function
      debouncedUpdate(dispatch, id, value);
    },
    [debouncedUpdate, dispatch]
  );

  const onRemoveFromCart = async (id: string) => {
    setIsLoadingDeleteBtn(true);
    const cartItem = new RemoveCartItemRequest({
      productId: id,
    });
    try {
      await service.client.cartsDELETE(userId, cartItem);
      toast({
        title: "Successfully delete from cart",
      });
      dispatch(removeFromCart(id));
    } catch (error) {
      console.log("Failed to remove item to cart");
    }
    setIsLoadingDeleteBtn(false);
  };
  return (
    <div className="grid grid-cols-12 gap-4 mt-4">
      <Card className="col-span-12 md:col-span-8">
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-secondary ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="text-primary"
                        key={header.id}
                        colSpan={header.colSpan}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {cartItems.length > 0 ? (
                cartItems.map((product) => (
                  <TableRow key={product.productId} className="items-center">
                    <TableCell className="flex gap-2 ">
                      <Image
                        src={product.pictureUrl ?? ""}
                        alt={product.productName ?? ""}
                        width={96}
                        height={96}
                        className="object-cover w-full block rounded-lg mb-4 h-16 min-w-16 max-w-16"
                      />
                      <span>{product.productName}</span>
                    </TableCell>
                    <TableCell className="text-primary">
                      {product.unitPrice?.toFixed(2)}$
                    </TableCell>
                    <TableCell className="gap-2">
                      <div className="w-28">
                        <InputNumber
                          min={1}
                          onChange={(value) =>
                            onChangeQuantity(product.productId ?? "", value)
                          }
                          initialValue={Number(product.quantity)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          onRemoveFromCart(product.productId ?? "")
                        }
                        disabled={isLoadingDeleteBtn}
                      >
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className="text-destructive cursor-pointer"
                          width={18}
                          height={18}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="col-span-12 md:col-span-4">
        <CardHeader>
          <CardTitle>Totals</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderSummary>
            <IconButton
              disabled={cartItems?.length === 0}
              className="w-full p-4"
              onClick={() => goToCheckOut()}
              variant="expandIcon"
              Icon={ArrowRightIcon}
              iconPlacement="right"
            >
              PROCEED TO CHECKOUT
            </IconButton>
          </OrderSummary>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListCart;
