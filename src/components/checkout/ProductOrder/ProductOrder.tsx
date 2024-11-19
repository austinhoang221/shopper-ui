import { GetByUserIdItemResponse } from "@/api/services/api";
import Image from "next/image";
import Link from "next/link";

export default function ProductOrder({
  product,
}: {
  product: GetByUserIdItemResponse;
}) {
  return (
    <div className="grid grid-cols-5 gap-4 mb-2">
      <div className="col-span-1">
        <Link
          href={product?.productName ?? ""}
          className="aspect-square w-16 block"
        >
          <Image
            src={product.pictureUrl ?? ""}
            alt={product.productName ?? ""}
            width={96}
            height={96}
            className="object-cover h-16 w-full block rounded-lg min-w-16 "
          />
        </Link>
      </div>
      <div className="col-span-4">
        <div className="">{product.productName}</div>
        <div className="">
          <span>{product.quantity} x </span>
          <span className="font-bold text-primary">${product.unitPrice}</span>
        </div>
      </div>
    </div>
  );
}
