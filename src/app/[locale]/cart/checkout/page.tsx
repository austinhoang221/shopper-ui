import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import UpdateBreadcrumb from "@/components/header/UpdateBreadcrumb";
import { IBreadcrumbState } from "@/reduxConfig/breadcrumbSlice";

const CheckoutPage = () => {
  const items: IBreadcrumbState[] = [
    {
      icon: "faCartShopping",
      href: `cart`,
      name: "Cart",
      key: `k-c-nav-cart`,
    },
    {
      icon: "faMoneyCheckAlt",
      href: `cart/checkout`,
      name: "Checkout",
      key: `k-c-nav-checkout`,
    },
  ];
  return (
    <>
      <UpdateBreadcrumb items={items} />
      <CheckoutForm />
    </>
  );
};
export default CheckoutPage;
