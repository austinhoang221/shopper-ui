import { CreateOrderRequest } from "@/app/api/services/api";
import PaypalPayment from "@/components/paypal-payment/PaypalPayment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { faCcPaypal } from "@fortawesome/free-brands-svg-icons";
import { faCreditCard, faMoneyBills } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
type Props = {
  order: CreateOrderRequest;
};
const PaymentOption = (props: Props) => {
  return (
    <Card>
      <Tabs defaultValue="paypal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-transparent">
          <TabsTrigger value="cash" className="flex flex-col items-center">
            <FontAwesomeIcon
              icon={faMoneyBills}
              className="text-primary"
              size="xl"
            />
            <span>Cash on Delivery</span>
          </TabsTrigger>
          <TabsTrigger value="paypal" className="flex flex-col items-center">
            <FontAwesomeIcon
              icon={faCreditCard}
              className="text-primary"
              size="xl"
            />
            <span>Online payment</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cash">
          <CardHeader></CardHeader>
          <CardContent className="space-y-2">Pay when receive</CardContent>
        </TabsContent>
        <TabsContent value="paypal">
          <CardHeader></CardHeader>
          <CardContent className="space-y-2">
            <PaypalPayment order={props.order} />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PaymentOption;
