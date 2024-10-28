import { GetByUserIdItemResponse } from "@/api/services/api";
import Image from "next/image";

export default function ProductOrder({ product }: { product: GetByUserIdItemResponse }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-1">
        <Image
          src={product.pictureUrl ?? ""}
          alt={product.productName ?? ""}
          width={200}
          height={200}
          className="w-full h-16 object-contain rounded-lg mb-4"
        />
      </div>
      <div className="col-span-4">
        <div className="">{product.productName}</div>
        <div className="">
          <span>{product.quantity} x </span>
          <span className="font-bold text-primary">
            ${product.unitPrice}
          </span>
        </div>
      </div>
    </div>
  );
}
