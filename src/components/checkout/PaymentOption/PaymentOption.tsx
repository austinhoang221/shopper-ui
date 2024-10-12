import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { faCcPaypal } from "@fortawesome/free-brands-svg-icons";
import { faMoneyBills } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PaymentOption = () => {
  return (
    <Card>
      <div className="text-bolder text-2xl p-4">Payment Option</div>
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
                icon={faCcPaypal}
                className="text-primary"
                size="xl"
              />
              <span>Paypal</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="paypal">
          <CardHeader>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name on Card</Label>
              <Input id="cardName" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Card Number</Label>
              <Input id="cardNumber" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="username">Expire Date</Label>
                <Input id="cardNumber" placeholder="DD/YY" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">CVC</Label>
                <Input id="cardNumber" />
              </div>
            </div>
          </CardContent>
        </TabsContent>
        <TabsContent value="password">
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PaymentOption;
