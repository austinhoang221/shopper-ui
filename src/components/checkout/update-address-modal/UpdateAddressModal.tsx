import { UserAddressResponse } from "@/app/api/services/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import React from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addresses: UserAddressResponse[];
  selectedAddress: UserAddressResponse;
  updateSelectedAddress: (address: UserAddressResponse) => void;
};

const UpdateAddressModal = (props: Props) => {
  const {
    isOpen,
    setIsOpen,
    addresses,
    selectedAddress,
    updateSelectedAddress,
  } = props;
  const [currentAddress, setCurrentAddress] =
    React.useState<UserAddressResponse>(selectedAddress);

  const onChangeAddress = (address: UserAddressResponse) => {
    setCurrentAddress(address);
  };
  const onChooseAddress = () => {
    updateSelectedAddress(currentAddress);
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>My addresses</DialogTitle>
        </DialogHeader>
        <RadioGroup value={currentAddress?.id}>
          {addresses?.map((address, index) => {
            return (
              <div className="mb-2" key={address.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      onClick={() => {
                        onChangeAddress(address);
                      }}
                      value={address.id!}
                      id={address.id}
                    />
                    <Label
                      htmlFor={address.id}
                      className="flex items-baseline gap-2"
                    >
                      <span className="text-base">{address.name}</span>
                      <span className="text-muted-foreground">
                        {address.phoneNumber}
                      </span>
                    </Label>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-muted-foreground">
                      {address.region}, {address.city}
                    </p>
                    <p className="text-muted-foreground">
                      {address.detailedAddress}
                    </p>
                  </div>
                </div>
                {address.isDefault && (
                  <span className="border border-primary p-1 text-primary mt-2">
                    Default
                  </span>
                )}
                {index !== addresses?.length - 1 && (
                  <Separator className="h-[1px] mt-4" />
                )}
              </div>
            );
          })}
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => onChooseAddress()}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAddressModal;
