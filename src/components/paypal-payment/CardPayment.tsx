"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import {
  PayPalCardFieldsForm,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";

const CardPayment = () => {
  const [isValid, setIsValid] = React.useState(true);
  const { cardFieldsForm } = usePayPalCardFields();

  const handleClick = async () => {
    if (!cardFieldsForm) {
      const childErrorMessage =
        "Unable to find any child components in the <PayPalCardFieldsProvider />";

      throw new Error(childErrorMessage);
    }
    const formState = await cardFieldsForm.getState();

    if (!formState.isFormValid) {
      setIsValid(false);
    }

    cardFieldsForm.submit();
  };
  return (
    <>
      {!isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>The payment form is invalid</AlertDescription>
        </Alert>
      )}
      <PayPalCardFieldsForm />
      <Button className="w-full" onClick={handleClick}>
        Pay
      </Button>
    </>
  );
};

export default CardPayment;
