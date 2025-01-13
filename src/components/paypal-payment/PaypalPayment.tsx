"use client";
import React from "react";
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";
import { service } from "@/app/api/services/service";
import {
  CapturePaymentRequest,
  CreateOrderRequest,
} from "@/app/api/services/api";
import { SeparatorWithText } from "../ui/separator-text";
import CardPayment from "./CardPayment";
import { ulid } from "ulidx";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { updateOrderId } from "@/app/store/orderSlice";
import { useParams, useRouter } from "next/navigation";
import { clearCart } from "@/app/store/cartSlice";
type Props = {
  order: CreateOrderRequest;
};
export default function PaypalPayment(props: Props) {
  const router = useRouter();
  const orderIdRef = React.useRef("");
  const params = useParams();
  const dispatch = useAppDispatch();

  const cardFieldStyle = {
    input: {
      height: "2.5rem", // Equivalent to h-10
      borderRadius: "calc(0.5rem - 2px)", // Equivalent to rounded-md
      border: "1px solid #E1E7EF", // Equivalent to border border-input
      padding: "0.5rem 1rem", // Equivalent to py-2 px-4
      fontSize: "0.875rem", // Equivalent to text-sm
      lineHeight: "1.25rem", // Matching your provided style
      outline: "none", // Equivalent to focus-visible:outline-none
      color: "#0A0A0A", // Default text color
      boxShadow: "none",
      "::placeholder": {
        color: "#757575", // Equivalent to placeholder:text-muted-foreground
      },
    },
    ":focus": {
      outline: "none", // Equivalent to focus-visible:outline-none
      boxShadow: "none", // For focus-visible:ring-1 focus-visible:ring-ring
      border: "1px solid #E1E7EF", // Equivalent to border border-input
    },
  };

  async function createOrder() {
    const response = await service.client.ordersPOST(ulid(), props.order);
    orderIdRef.current = response.id ?? "";
    return response?.partnerTransactionId ?? "";
  }

  async function onApprove(data: A) {
    try {
      const model = CapturePaymentRequest.fromJS({
        orderId: orderIdRef.current,
        partnerTransactionId: data.orderID,
      });
      await service.client.capture(model);
    } catch (error) {
    } finally {
      router.push(`/${params.locale}/user/orders`);
      dispatch(clearCart());
    }
  }

  function onError(error: A) {
    // Do something with the error from the SDK
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        components: "card-fields,buttons",
        currency: "EUR ",
      }}
    >
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        className="z-[1] relative"
      />
      <SeparatorWithText>Or</SeparatorWithText>
      <PayPalCardFieldsProvider
        createOrder={createOrder}
        onApprove={onApprove}
        style={cardFieldStyle}
        onError={onError}
      >
        <CardPayment />
      </PayPalCardFieldsProvider>
    </PayPalScriptProvider>
  );
}
