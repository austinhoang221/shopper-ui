"use client";
import { service } from "@/api/services/service";
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

import { faArrowRight, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const ListCart = () => {
  const onRemoveFromCart = (id: string) => {
    // dispatch(removeFromCart(id));
  };
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [cartData, setCartData] = React.useState([]);

  // const columns: ColumnDef<CartItem>[] = [
  //   {
  //     accessorKey: "products",
  //     header: "Products",
  //   },
  //   {
  //     accessorKey: "price",
  //     header: "Price",
  //   },
  //   {
  //     accessorKey: "quantity",
  //     header: "Quantity",
  //   },
  //   {
  //     accessorKey: "action",
  //     header: "",
  //   },
  // ];
  // const table = useReactTable({
  //   data: cartItems,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  // });

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await service.client.cartsGET();
      // setCartData(data);
    };

    fetchData();
  }, []);

  const goToCheckOut = () => {
    router.push("cart/checkout");
  };
  return (
    // <div className="grid grid-cols-12 gap-4 mt-4">
    //   <UpdateBreadcrumb items={items} />
    //   <Card className="col-span-12 md:col-span-8">
    //     <CardHeader>
    //       <CardTitle>Shopping Cart</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <Table>
    //         <TableHeader className="bg-secondary ">
    //           {table.getHeaderGroups().map((headerGroup) => (
    //             <TableRow key={headerGroup.id}>
    //               {headerGroup.headers.map((header) => {
    //                 return (
    //                   <TableHead
    //                     className="text-primary"
    //                     key={header.id}
    //                     colSpan={header.colSpan}
    //                   >
    //                     {header.isPlaceholder
    //                       ? null
    //                       : flexRender(
    //                           header.column.columnDef.header,
    //                           header.getContext()
    //                         )}
    //                   </TableHead>
    //                 );
    //               })}
    //             </TableRow>
    //           ))}
    //         </TableHeader>
    //         <TableBody>
    //           {cartData.length > 0 ? (
    //             cartData.map((product) => (
    //               <TableRow key={product.item.id} className="items-center">
    //                 <TableCell className="flex gap-2 ">
    //                   <Image
    //                     src={product.item.attachments?.[0]?.link ?? ""}
    //                     alt={product.item.name ?? ""}
    //                     width={96}
    //                     height={96}
    //                     className="object-cover w-full block rounded-lg mb-4 h-16 min-w-16 max-w-16"
    //                   />
    //                   <span>{product.item.name}</span>
    //                 </TableCell>
    //                 <TableCell className="text-primary">
    //                   {product.item.sellingPrice?.toFixed(2)}$
    //                 </TableCell>
    //                 <TableCell className="gap-2">
    //                   <div className="w-28">
    //                     <InputNumber
    //                       min={1}
    //                       initialValue={Number(product.quantity)}
    //                     />
    //                   </div>
    //                 </TableCell>
    //                 <TableCell>
    //                   <Button
    //                     size="icon"
    //                     variant="ghost"
    //                     onClick={() =>
    //                       onRemoveFromCart(product.item.id?.toString() ?? "")
    //                     }
    //                   >
    //                     <FontAwesomeIcon
    //                       icon={faTrashCan}
    //                       className="text-destructive cursor-pointer"
    //                       width={18}
    //                       height={18}
    //                     />
    //                   </Button>
    //                 </TableCell>
    //               </TableRow>
    //             ))
    //           ) : (
    //             <TableRow>
    //               <TableCell
    //                 colSpan={columns.length}
    //                 className="h-24 text-center"
    //               >
    //                 No results.
    //               </TableCell>
    //             </TableRow>
    //           )}
    //         </TableBody>
    //       </Table>
    //     </CardContent>
    //   </Card>
    //   <Card className="col-span-12 md:col-span-4">
    //     <CardHeader>
    //       <CardTitle>Totals</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <OrderSummary>
    //         <Button
    //           disabled={cartItems.length === 0}
    //           className="w-full bg-secondary text-secondary-foreground p-4"
    //           onClick={() => goToCheckOut()}
    //         >
    //           PROCEED TO CHECKOUT
    //           <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
    //         </Button>
    //       </OrderSummary>
    //     </CardContent>
    //   </Card>
    // </div>
    <></>
  );
};

export default ListCart;
