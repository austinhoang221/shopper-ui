"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userIdCookie } from "@/utils/constants";
import React from "react";
import { service } from "@/app/api/services/service";
import { getCookie } from "cookies-next";
import withAuth from "@/hoc/Auth";
import {
  UserAddressResponse,
  UserUpdateAddressesRequest,
} from "@/app/api/services/api";
import CreateModal from "./createModal/CreateModal";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/hooks/use-toast";
import { useSession } from "next-auth/react";

import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import Empty from "../../category/[category]/Empty";
import Loading from "@/components/motion/Loading";

const Address = () => {
  const userId = getCookie(userIdCookie);
  const { status } = useSession();
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isLoadingDeleteBtn, setIsLoadingDeleteBtn] =
    React.useState<boolean>(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] =
    React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<string>("");
  const [selectedAddress, setSelectedAddress] =
    React.useState<UserUpdateAddressesRequest>();
  const [addresses, setAddresses] = React.useState<UserAddressResponse[]>([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await service.client.addressesAll(userId ?? "");
    setAddresses(response);
    setIsLoading(false);
  };

  const onClickUpdate = (address: UserAddressResponse) => {
    setSelectedAddress(address as UserUpdateAddressesRequest);
    setIsOpenModal(true);
  };

  const handleDelete = async () => {
    setIsLoadingDeleteBtn(true);
    const deleteIndex = addresses.findIndex(
      (address) => address.id === deleteId
    );
    if (deleteIndex !== -1) {
      addresses.splice(deleteIndex, 1);
      await service.client.addresses(userId as string, [...addresses]);
      toast({
        title: "Successfully delete an address",
      });
      setDeleteId("");
      setIsOpenConfirmModal(false);
      setIsLoadingDeleteBtn(false);
      fetchData();
    }
  };

  const onClickDelete = (id: string) => {
    setDeleteId(id);
    setIsOpenConfirmModal(true);
  };

  const setDefaultAddress = async (address: UserAddressResponse) => {
    const deleteIndex = addresses.findIndex((item) => item.id === address.id);
    if (deleteIndex !== -1) {
      const request: UserUpdateAddressesRequest[] = addresses.map((item) => {
        return UserUpdateAddressesRequest.fromJS({ ...item, isDefault: false });
      });
      request.splice(
        deleteIndex,
        1,
        UserUpdateAddressesRequest.fromJS({ ...address, isDefault: true })
      );
      await service.client.addresses(userId as string, [...request]);
      toast({
        title: "Successfully delete an address",
      });
      fetchData();
    }
    fetchData();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between">
              My Address
              <CreateModal
                isOpen={isOpenModal}
                onOpenChange={setIsOpenModal}
                address={selectedAddress}
                addresses={addresses}
                onUpdate={() => fetchData()}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[50vh]">
          {status === "loading" || isLoading ? (
            <Loading />
          ) : (
            <>
              {addresses?.length === 0 ? (
                <Empty />
              ) : (
                <>
                  {addresses?.map((address, index) => {
                    return (
                      <div key={address.id} className="mb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-base">{address.name}</span>
                            <div className="h-6">
                              <Separator
                                orientation="vertical"
                                className="mx-2"
                              />
                            </div>
                            <span className="text-muted-foreground">
                              {address.phoneNumber}
                            </span>
                          </div>
                          <div className="flex">
                            <Button
                              variant="link"
                              className="p-0 mr-2"
                              onClick={() => onClickUpdate(address)}
                            >
                              Update
                            </Button>
                            <Button
                              variant="link"
                              className="p-0"
                              onClick={() => onClickDelete(address.id!)}
                            >
                              Delete
                            </Button>
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
                          {!address.isDefault && (
                            <Button
                              variant="outline"
                              onClick={() => setDefaultAddress(address)}
                            >
                              Config default
                            </Button>
                          )}
                        </div>
                        {address.isDefault && (
                          <span className="border border-primary p-1 text-primary mt-2">
                            Default
                          </span>
                        )}
                        {index === addresses?.length - 1}{" "}
                        <Separator className="h-1/2 " />
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={isOpenConfirmModal} onOpenChange={setIsOpenConfirmModal}>
        <DialogContent className="sm:max-w-[425px]">
          Are you sure you want to delete this address?
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpenConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button loading={isLoadingDeleteBtn} onClick={() => handleDelete()}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default withAuth(Address);
