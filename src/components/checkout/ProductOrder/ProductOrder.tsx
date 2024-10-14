import { CartItem } from "@/reduxConfig/cartSlice";
import Image from "next/image";

export default function ProductOrder({ product }: { product: CartItem }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-1">
        <Image
          src={product.item.images[0]}
          alt={product.item.title}
          width={200}
          height={200}
          className="w-full h-16 object-contain rounded-lg mb-4"
        />
      </div>
      <div className="col-span-4">
        <div className="">{product.item.title}</div>
        <div className="">
          <span>{product.quantity} x </span>
          <span className="font-bold text-[#674636]">${product.item.price}</span>
        </div>
      </div>
    </div>
  );
}
