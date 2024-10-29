"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./CheckoutForm.scss";
import { toast } from "@/components/hooks/use-toast";
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
// import PaymentOption from "./PaymentOption/PaymentOption";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ProductOrder from "./ProductOrder/ProductOrder";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  calculateShipping,
  getCities,
  getCountries,
  getRegions,
  Place,
  ShippingRate,
} from "@/api/services/externalApiService";
// import { useFormStatus } from "react-dom";
import { OrderSummary } from "../order-summary/OrderSummary";
import { service } from "@/api/services/service";
import { GetByUserIdResponse } from "@/api/services/api";
import { getCookie } from "cookies-next";
import { userIdCookie } from "@/utils/constants";

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
  const [countries, setCountries] = useState<Place[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [regions, setRegions] = useState<Place[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [cities, setCities] = useState<Place[]>([]);
  const [shippingRate, setShippingRate] = useState<ShippingRate[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [cart, setCart] = React.useState<GetByUserIdResponse | null>(null);

  // const { pending } = useFormStatus();

  React.useEffect(() => {
    const fetchData = async () => {
      const userId = getCookie(userIdCookie);
      const data = await service.client.cartsGET(userId);
      setCart(data);
    };

    fetchData();
  }, []);

  console.log(shippingRate);
  useEffect(() => {
    const fetchCountries = async () => {
      const countryData = await getCountries();
      setCountries(countryData);
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    const fetchRegions = async () => {
      const regionData = await getRegions(selectedCountry);
      setRegions(regionData);
    };

    fetchRegions();
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedRegion) return;
    const fetchCities = async () => {
      const cityData = await getCities(selectedRegion);
      setCities(cityData);
    };

    fetchCities();
  }, [selectedRegion]);

  const handleShippingCalculation = async () => {
    if (!form.watch("address") || !form.watch("zipcode")) return;
    try {
      const address = {
        name: form.watch("username"),
        street: form.watch("address"),
        city:
          cities.find((city) => city.geonameId == form.watch("city"))?.name ??
          "",
        state:
          regions.find((region) => region.geonameId == selectedRegion)?.name ??
          "",
        zip: form.watch("zipcode"),
        country:
          countries.find((country) => country.geonameId == selectedCountry)
            ?.countryCode ?? "",
      };
      const parcel = {
        length: 10,
        width: 8,
        height: 4,
        weight: 2,
      };
      const rate = await calculateShipping(address, parcel);
      console.log("Shipping Rate:", rate);
      setShippingRate(rate);
    } catch (error) {
      console.error("Error fetching shipping rate:", error);
    }
  };

  const debounceShippingCalculation = () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      handleShippingCalculation();
    }, 4000);

    setDebounceTimeout(timeout);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      company: "",
      address: "",
      country: "",
      region: "",
      city: "",
      zipcode: "",
      email: "",
      phone: "",
      isShip: false,
      note: "",
    },
  });

  const onRenderCheckoutButton = () => (
    <Button className="w-full p-4" variant="default">
      CHECKOUT
      <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
    </Button>
  );

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 md:col-span-8 order-2 md:order-1">
        <CardContent>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
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
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Company Name
                          <span className="hidden md:inline"> (Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Company" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Address"
                          {...field}
                          onChange={(event) => {
                            field.onChange(event);
                            debounceShippingCalculation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCountry(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.geonameId}
                                value={country.geonameId}
                              >
                                {country.countryName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region/State</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedRegion(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem
                                key={region.geonameId}
                                value={region.geonameId}
                              >
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
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
                            {cities.map((city) => (
                              <SelectItem
                                key={city.geonameId}
                                value={city.geonameId}
                              >
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Zip Code"
                            {...field}
                            onChange={(event) => {
                              field.onChange(event);
                              debounceShippingCalculation();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isShip"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Ship into different address</FormLabel>
                    </FormItem>
                  )}
                />
                {/* <PaymentOption /> */}
                <CardTitle className="py-6">Additional Information</CardTitle>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notes about your order, e.g. special notes for delivery"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </CardContent>
      </Card>
      <div className="col-span-12 md:col-span-4 order-1 md:order-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {cart?.items?.map((product) => (
              <ProductOrder key={product.productId} product={product} />
            ))}
            <div className="hidden md:block">
              <OrderSummary
              // shippingRate={
              //   shippingRate.length > 0 ? shippingRate[0].amount : 0
              // }
              >
                {onRenderCheckoutButton()}
              </OrderSummary>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="block md:hidden col-span-12 md:col-span-4 order-2 md:order-3">
        <Card>
          <CardHeader>
            <CardTitle>Totals</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderSummary
            // shippingRate={
            //   shippingRate.length > 0 ? shippingRate[0].amount : 0
            // }
            >
              {onRenderCheckoutButton()}
            </OrderSummary>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
