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
import { Textarea } from "../ui/textarea";
// import PaymentOption from "./PaymentOption/PaymentOption";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ProductOrder from "./product-order/ProductOrder";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  calculateShipping,
  getCities,
  getRegions,
  Place,
  ShippingRate,
} from "@/app/api/services/externalApiService";
// import { useFormStatus } from "react-dom";
import { OrderSummary } from "../order-summary/OrderSummary";
import { service } from "@/app/api/services/service";
import {
  CreateOrderItemRequest,
  CreateOrderRequest,
  UserAddressResponse,
} from "@/app/api/services/api";
import { getCookie } from "cookies-next";
import { PHONE_NUMBER_REGEX, userIdCookie } from "@/utils/constants";
import { useAppSelector } from "../hooks/redux";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ArrowRightIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";

import { IconButton } from "../ui/icon-button";
import withAuth from "@/hoc/Auth";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import UpdateAddressModal from "./update-address-modal/UpdateAddressModal";

const FormSchema = z.object({
  username: z.string().trim().min(1, {
    message: "Name is required",
  }),
  address: z.string().trim().min(1, {
    message: "Address is required",
  }),
  country: z.string(),
  region: z.string(),
  city: z.string(),
  zipcode: z.string(),
  email: z
    .string()
    .trim()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Email must in correct format",
    }),
  phone: z
    .string()
    .trim()
    .min(1, {
      message: "Phone is required",
    })
    .regex(PHONE_NUMBER_REGEX, {
      message: "Phone must in correct format",
    }),
  isShip: z.boolean().default(false).optional(),
  note: z.string(),
});

const CheckoutForm = () => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const { data: userData } = useSession();
  const [countries, setCountries] = useState<Place[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    "3017382"
  );
  const [regions, setRegions] = useState<Place[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>();
  const [cities, setCities] = useState<Place[]>([]);
  const [shippingRate, setShippingRate] = useState<ShippingRate[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isAddressLoaded, setIsAddressLoaded] = React.useState<boolean>(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] =
    React.useState<boolean>(false);

  const [addresses, setAddresses] = React.useState<UserAddressResponse[]>([]);

  const [selectedAddress, setSelectedAddress] =
    React.useState<UserAddressResponse | null>(null);
  const userId = getCookie(userIdCookie);

  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     const countryData = await getCountries();
  //     setCountries(countryData);
  //   };

  //   fetchCountries();
  // }, []);

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

  React.useEffect(() => {
    fetchAddress();
  }, [userData]);

  const fetchAddress = async () => {
    if (userData && addresses?.length === 0 && !isAddressLoaded) {
      setIsLoading(true);
      const response = await service.client.addressesAll(userId ?? "");
      setAddresses(response);
      setSelectedAddress(response?.find((res) => res.isDefault) ?? null);
      setIsLoading(false);
      setIsAddressLoaded(true);
    }
  };

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
      address: "",
      country: "France",
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
    <IconButton
      className="w-full p-4"
      onClick={() => onSubmit()}
      variant="expandIcon"
      Icon={ArrowRightIcon}
      iconPlacement="right"
    >
      CHECKOUT
    </IconButton>
  );

  const onSubmit = async () => {
    await form.trigger();
    const formValue = form.getValues();

    if (form.formState.isValid || selectedAddress) {
      const model = CreateOrderRequest.fromJS({
        street: selectedAddress ? selectedAddress.street : formValue?.address,
        city: selectedAddress ? selectedAddress.city : formValue?.city,
        state: selectedAddress ? selectedAddress.state : formValue?.region,
        country: selectedAddress ? selectedAddress.country : formValue?.country,
        zipCode: formValue?.zipcode,
        region: selectedAddress ? selectedAddress.region : formValue?.region,
        buyerId: userId,
        buyerPhone: selectedAddress
          ? selectedAddress.phoneNumber
          : formValue?.phone,
        buyerEmail: userData?.user?.email,
        buyerName: selectedAddress ? selectedAddress.name : formValue?.username,
        description: formValue?.note,
        // orderCd: formValue?.,
        remark: formValue?.note,
        orderItems: cartItems?.map((item) => {
          return CreateOrderItemRequest.fromJS({
            productId: item.productId,
            productName: item.productName,
            unitPrice: item.unitPrice,
            discounts: 0,
            pictureUrl: item.pictureUrl,
            units: item.quantity,
          });
        }),
      });
      await service.client.ordersPOST(userId, model);
    } else {
      toast({
        title: "Please input all required fields",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 mt-4">
      <Card className="col-span-12 md:col-span-8 order-2 md:order-1">
        <CardContent>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {addresses?.length === 0 && !selectedAddress ? (
                  <>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <div className="gap-4">
                            <FormControl className="col-span-1">
                              <Input placeholder="Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormLabel>Address *</FormLabel>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {/* <FormField
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
                  /> */}

                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region/State</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? regions.find(
                                          (language) =>
                                            language.geonameId.toString() ===
                                            field.value
                                        )?.name
                                      : "Select region"}
                                    <ChevronsUpDown className="opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search"
                                    className="h-9"
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      No region found.
                                    </CommandEmpty>
                                    {regions.map((region) => (
                                      <CommandItem
                                        value={region.name}
                                        key={region.geonameId}
                                        onSelect={() => {
                                          form.setValue(
                                            "region",
                                            region.geonameId.toString()
                                          );
                                          setSelectedRegion(region.geonameId);
                                        }}
                                      >
                                        {region.name}
                                        <Check
                                          width={20}
                                          className={cn(
                                            "ml-auto",
                                            region.geonameId.toString() ===
                                              field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
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
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? cities.find(
                                          (city) =>
                                            city.geonameId.toString() ===
                                            field.value
                                        )?.name
                                      : "Select city"}
                                    <ChevronsUpDown className="opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search..."
                                    className="h-9"
                                  />
                                  <CommandList>
                                    <CommandEmpty>No city found.</CommandEmpty>
                                    <CommandGroup>
                                      {cities.map((city) => (
                                        <CommandItem
                                          value={city.name.toString()}
                                          key={city.geonameId}
                                          onSelect={() => {
                                            form.setValue(
                                              "city",
                                              city.geonameId.toString()
                                            );
                                          }}
                                        >
                                          {city.name}
                                          <Check
                                            width={20}
                                            className={cn(
                                              "ml-auto",
                                              city.geonameId.toString() ===
                                                field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
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
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
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
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="Phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="text-primary">
                      <FontAwesomeIcon className="mr-2" icon={faLocationDot} />
                      <FormLabel>Address</FormLabel>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex">
                        <span className="font-bold">
                          {selectedAddress?.name} {selectedAddress?.phoneNumber}
                        </span>
                      </div>
                      <div className="w-full">
                        <span className="mr-2">
                          {selectedAddress?.detailedAddress}
                        </span>
                        <span className="border border-primary p-1 text-primary">
                          Default
                        </span>
                      </div>
                      <Button
                        variant="link"
                        className="p-0 mr-2"
                        onClick={() => {
                          setIsOpenUpdateModal(true);
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                )}

                {/* <FormField
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
                /> */}
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
            {cartItems?.map((product) => (
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
      {selectedAddress && (
        <UpdateAddressModal
          isOpen={isOpenUpdateModal}
          setIsOpen={setIsOpenUpdateModal}
          addresses={addresses}
          selectedAddress={selectedAddress}
          updateSelectedAddress={setSelectedAddress}
        />
      )}
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
};
export default withAuth(CheckoutForm);
