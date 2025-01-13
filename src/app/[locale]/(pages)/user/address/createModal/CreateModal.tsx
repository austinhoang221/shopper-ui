import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { service } from "@/app/api/services/service";
import { toast } from "@/components/hooks/use-toast";
import { z } from "zod";
import {
  autocomplete,
  getCities,
  getRegions,
  Place,
} from "@/app/api/services/externalApiService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserAddressResponse,
  UserUpdateAddressesRequest,
} from "@/app/api/services/api";
import { getCookie } from "cookies-next";
import { PHONE_NUMBER_REGEX, userIdCookie } from "@/utils/constants";
import debounce from "lodash.debounce";
import MapComponent from "@/components/ui/map";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX, {
    message: "Phone must in correct format",
  }),
  city: z.string().min(1, {
    message: "City required",
  }),
  //   state: z.string(),
  region: z.string().min(1, {
    message: "Region is required",
  }),
  //   country: z.string(),
  //   street: z.string(),
  detailedAddress: z.string().min(1, {
    message: "Address is required",
  }),
});

type Props = {
  address?: UserAddressResponse;
  isOpen: boolean;
  onUpdate: () => void;
  onOpenChange: (open: boolean) => void;
  addresses: UserAddressResponse[];
};

const CreateModal = (props: Props) => {
  const userId = getCookie(userIdCookie);
  const [isLoadingBtn, setIsLoadingBtn] = React.useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = React.useState<string | null>(
    "3017382"
  );
  const [regions, setRegions] = React.useState<Place[]>([]);
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>();
  const [cities, setCities] = React.useState<Place[]>([]);
  const [query, setQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<Place[]>([]);

  const debouncedFetchAutocomplete = React.useCallback(
    debounce(async (query: string) => {
      if (query.length > 2) {
        try {
          const places = await autocomplete(query);
          setResults(places);
        } catch (error) {
          console.error("Error fetching autocomplete results:", error);
        }
      } else {
        setResults([]);
      }
    }, 500),
    []
  );

  React.useEffect(() => {
    debouncedFetchAutocomplete(query);
    return () => debouncedFetchAutocomplete.cancel();
  }, [query, debouncedFetchAutocomplete]);

  const getAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    form.setValue("detailedAddress", value ?? "");
  };

  const handlePlaceSelect = (place: string) => {
    setQuery(place);
    form.setValue("detailedAddress", place ?? "");
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      city: "",
      //   state: "",
      region: "",
      //   street: "",
      detailedAddress: "",
    },
  });

  React.useEffect(() => {
    if (!props.isOpen) {
      form.reset();
    }
  }, [props.isOpen]);

  React.useEffect(() => {
    if (props.isOpen && props.address) {
      form.setValue("name", props.address.name ?? "");
      form.setValue("city", props.address.cityCode ?? "");
      form.setValue("phoneNumber", props.address.phoneNumber ?? "");
      form.setValue("region", props.address.regionCode ?? "");
      setSelectedRegion(props.address.regionCode);
      form.setValue("detailedAddress", props.address.detailedAddress ?? "");
    }
  }, [props.isOpen, props.address]);

  React.useEffect(() => {
    if (!selectedCountry) return;
    const fetchRegions = async () => {
      const regionData = await getRegions(selectedCountry);
      setRegions(regionData);
      // setSelectedRegion(regionData?.[0]?.geonameId.toString());
      // form.setValue("region", regionData?.[0]?.geonameId.toString());
    };

    fetchRegions();
  }, [selectedCountry]);

  React.useEffect(() => {
    if (!selectedRegion) return;
    const fetchCities = async () => {
      const cityData = await getCities(selectedRegion);
      setCities(cityData);
      // form.setValue("city", cityData?.[0]?.geonameId.toString());
    };

    fetchCities();
  }, [selectedRegion]);

  const onSubmit = async () => {
    const formValue = form.getValues();
    await form.trigger();
    if (form.formState.isValid) {
      setIsLoadingBtn(true);
      const model = UserUpdateAddressesRequest.fromJS({
        name: formValue.name,
        country: "France",
        cityCode: form.watch("city")?.toString() ?? "",
        city:
          cities.find(
            (city) => city.geonameId?.toString() == form.watch("city")
          )?.name ?? "",
        street:
          regions.find(
            (region) => region.geonameId?.toString() == selectedRegion
          )?.name ?? "",
        stateCode: selectedRegion?.toString() ?? "",
        regionCode: selectedRegion?.toString(),
        streetCode: "Fixed",
        state:
          regions.find(
            (region) => region.geonameId?.toString() == selectedRegion
          )?.name ?? "",
        region:
          regions.find(
            (region) => region.geonameId?.toString() == selectedRegion
          )?.name ?? "",
        detailedAddress: formValue.detailedAddress,
        phoneNumber: formValue.phoneNumber,
      });
      if (props.address) {
        const index = props.addresses.findIndex(
          (address) => address.id === props.address?.id
        );
        props.addresses.splice(index, 1, model);
        await service.client.addresses(userId as string, [...props.addresses]);
      } else {
        if (props.addresses?.length === 0) model.isDefault = true;
        await service.client.addresses(userId as string, [
          ...props.addresses,
          model,
        ]);
      }
      setIsLoadingBtn(false);
      props.onOpenChange(false);
      props.onUpdate();
      toast({
        title: "Successfully",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Please input all required fields",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <FontAwesomeIcon className="mr-2" icon={faPlus} />
          Add new address
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>New address</DialogTitle>
          <DialogDescription>Add new address to use later</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mb-3">
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
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <div className="gap-4">
                          <FormControl className="col-span-1">
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between border-[#e5e7eb] hover:bg-white ",
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
                                <ChevronsUpDown
                                  className="opacity-50"
                                  width={18}
                                  height={18}
                                />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search"
                                className="h-9"
                              />
                              <CommandList className="max-h-[200px]">
                                <CommandEmpty>No region found.</CommandEmpty>
                                {regions.map((region) => (
                                  <CommandItem
                                    value={region.name}
                                    key={region.geonameId}
                                    onSelect={() => {
                                      form.setValue(
                                        "region",
                                        region.geonameId.toString()
                                      );
                                      setSelectedRegion(
                                        region.geonameId.toString()
                                      );
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
                      <FormItem className="mb-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between border-[#e5e7eb]  hover:bg-white",
                                  !field.value && "text-muted-foreground  "
                                )}
                              >
                                {field.value
                                  ? cities.find(
                                      (city) =>
                                        city.geonameId.toString() ===
                                        field.value
                                    )?.name
                                  : "Select city"}
                                <ChevronsUpDown
                                  className="opacity-50"
                                  width={18}
                                  height={18}
                                />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search..."
                                className="h-9"
                              />
                              <CommandList className="max-h-[200px]">
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
                    name="detailedAddress"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <div className="gap-4">
                          <FormControl className="col-span-1">
                            <Input
                              placeholder="Address"
                              value={field.value}
                              // {...field}
                              onChange={getAddress}
                            />
                            {/* {results.map((place) => (
                          <li key={place.id}>{place.name}</li>
                        ))} */}
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => props.onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button loading={isLoadingBtn} onClick={() => onSubmit()}>
                Save
              </Button>
            </DialogFooter>
          </div>
          <div>
            <MapComponent onPlaceSelect={handlePlaceSelect} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;
