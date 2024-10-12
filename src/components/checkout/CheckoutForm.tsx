"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./CheckoutForm.scss";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import PaymentOption from "./PaymentOption/PaymentOption";
import { Card, CardContent } from "../ui/card";
import ProductOrder, { DummyProduct } from "./ProductOrder/ProductOrder";
import React from "react";
import { getProducts } from "../product/GetProducts";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  company: z.string(),
  address: z.string(),
  country: z.string(),
  region: z.string(),
  city: z.string(),
  zipcode: z.string(),
  email: z.string(),
  phone: z.string(),
  isShip: z.boolean().default(false).optional(),
  note: z.string(),
});

export function CheckoutForm() {
  const [products, setProducts] = React.useState<DummyProduct[]>([]);
  const [hasMore, setHasMore] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setTimeout(async () => {
      if (hasMore) {
        const data = await getProducts(1, 3);
        if (data.products.length < 4) {
          setHasMore(false);
        }
        setProducts([...data.products]);
      }
    }, 800);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="flex flex-col-reverse md:flex-row space-x-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:w-2/3 space-y-6"
        >
          <div className="text-bolder text-2xl my-8">Billing Information</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <>
                    <FormItem className="col-span-1">
                      <FormLabel>User name</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                        <FormControl className="col-span-1">
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  </>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Company Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <div className="grid grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Vietnam">
                          Vietnam number one
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Region/State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Vietnam">
                          Vietnam number one
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Vietnam">
                          Vietnam number one
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Zip Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isShip"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Ship into different address</FormLabel>
                </FormItem>
              </>
            )}
          />
          <PaymentOption />
          <div className="text-bolder text-2xl my-8">
            Additional Information
          </div>
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Order Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes about your order, e.g. special notes for delivery"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              </>
            )}
          />
        </form>
      </Form>
      <div className="w-full md:w-1/3 space-y-6 my-8">
        <Card>
          <div className="text-bolder text-2xl p-4">Order Summary</div>
          <CardContent>
            {products.map((product) => (
              <ProductOrder key={product.id} product={product} />
            ))}
            <div className="grid grid-cols-2 py-2">
              <span>Sub-total</span>
              <span className="text-right">$320</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span>Shipping</span>
              <span className="text-right">Free</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span>Discount</span>
              <span className="text-right">$24</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span>Tax</span>
              <span className="text-right">$61.99</span>
            </div>
            <hr />
            <div className="grid grid-cols-2 py-2 font-medium text-2xl">
              <span>Total</span>
              <span className="text-right">$357.99USD</span>
            </div>
            <Button className="w-full btn-place-order p-4">
              PLACE ORDER &nbsp;&#8594;
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
