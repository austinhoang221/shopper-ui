import { Separator } from "../ui/separator";
import { useUtils } from "@/hooks/use-utils";

export function OrderSummary({ children }) {
  const { calculateTotalCart } = useUtils();
  const tax = parseFloat(calculateTotalCart) / 10;
  const ship = 5;
  const discount = 0;
  const total = parseFloat(calculateTotalCart) + tax + ship - discount;

  return (
    <>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Sub-total</span>
        <span>${calculateTotalCart}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Shipping</span>
        <span>${ship.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Discount</span>
        <span>${discount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <Separator className="bg-[#d5dbdb] mt-4" />
      <div className="flex justify-between items-center my-4">
        <span>Total: </span>
        <span className="text-lg text-primary font-bold">
          ${total.toFixed(2)}
        </span>
      </div>

      {children}
    </>
  );
}
