import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TrackOrderPage = () => {
  return (
    <Card>
      <CardContent>
        <div className="text-bolder text-2xl my-8">Track Order</div>
        <div className="pb-4">
          <span>
            To track your order please enter your order ID in the input field
            and press the &#34;Track Order&#34; button.{" "}
          </span>
          <span>
            This was given to you on your receipt and in the confirmation email
            you should have received.
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid w-full max-w-sm items-center gap-4">
            <Label htmlFor="order">Order ID</Label>
            <Input type="text" id="order" placeholder="ID..." />
          </div>
          <div className="grid w-full max-w-sm items-center gap-4">
            <Label htmlFor="email">Billing Email</Label>
            <Input type="email" id="email" placeholder="Email address" />
          </div>
        </div>

        <div className="pb-4">
          Order ID that we sended to your in your email address.
        </div>
        <Button
          size={"lg"}
          variant={"outline"}
          className="border-2 border-[#674636] bg-[#F7EED3] text-black"
        >
          <span className="font-bold">TRACK ORDER &nbsp;&#8594;</span>
        </Button>
      </CardContent>
    </Card>
  );
};
export default TrackOrderPage;
