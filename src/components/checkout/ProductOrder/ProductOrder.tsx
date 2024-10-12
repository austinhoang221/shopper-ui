import Image from "next/image";

export interface DummyProduct {
  id: number;
  title: string;
  images: string[];
  price: number;
}

export default function ProductOrder({ product }: { product: DummyProduct }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-1">
        <Image
          src={product.images[0]}
          alt={product.title}
          width={200}
          height={200}
          className="w-full h-16 object-contain rounded-lg mb-4"
        />
      </div>
      <div className="col-span-4">
        <div className="">{product.title}</div>
        <div className="">
          <span>1 x </span>
          <span className="font-bold text-[#674636]">${product.price}</span>
        </div>
      </div>
    </div>
  );
}
