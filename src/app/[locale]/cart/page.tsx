"use client";
import { DummyProduct } from "@/components/product/Product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputNumber from "@/components/ui/input-number";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useUtils } from "@/hooks/use-utils";
import { CartItem, removeFromCart } from "@/reduxConfig/cartSlice";
import { faArrowRight, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import React from "react";

type Props = {};

const ListCart = (props: Props) => {
  const { calculateTotalCart } = useUtils();
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const onRemoveFromCart = (id: string) => {
    dispatch(removeFromCart(id));
  };
  const columns: ColumnDef<CartItem>[] = [
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
  return (
    <div className="grid grid-cols-12 gap-4 mt-4">
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-secondary text-secondary-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
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
                  <TableRow key={product.item.id} className="items-center">
                    <TableCell className="flex gap-2 ">
                      <Image
                        src={product.item.images[0]}
                        alt={product.item.title}
                        width={96}
                        height={96}
                        className="object-cover w-full block rounded-lg mb-4 h-16 min-w-16 max-w-16"
                      />
                      <span>{product.item.title}</span>
                    </TableCell>
                    <TableCell>{product.item.price.toFixed(2)}$</TableCell>
                    <TableCell className="gap-2">
                      <InputNumber
                        min={1}
                        initialValue={Number(product.quantity)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          onRemoveFromCart(product.item.id.toString())
                        }
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
