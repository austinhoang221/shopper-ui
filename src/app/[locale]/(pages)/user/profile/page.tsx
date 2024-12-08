"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { PHONE_NUMBER_REGEX, userIdCookie } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { service } from "@/app/api/services/service";
import { getCookie } from "cookies-next";
import { toast } from "@/components/hooks/use-toast";
import { UpdateUserRequest } from "@/app/api/services/api";

const FormSchema = z.object({
  name: z.string(),
  username: z.string().optional(),
  email: z.string().email(),
  // phoneNumber: z.union([
  //   z.string().optional(),
  //   z.string().trim().regex(PHONE_NUMBER_REGEX),
  // ]),
});
const UserInfo = () => {
  const { data: userData } = useSession();
  const [isLoadingBtn, setIsLoadingBtn] = React.useState<boolean>(false);
  const userId = getCookie(userIdCookie);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      username: "",
      phoneNumber: "",
      email: "",
    },
  });

  React.useEffect(() => {
    form.setValue("name", userData?.user?.name ?? "");
    form.setValue("username", userData?.user?.username ?? "");
    // form.setValue("phoneNumber", userData?.user?.phoneNumber ?? "");
    form.setValue("email", userData?.user?.email ?? "");
  }, [userData]);

  const onSubmit = async () => {
    form.trigger();
    const formValue = form.getValues();
    if (form.formState.isValid) {
      const model = UpdateUserRequest.fromJS({
        name: formValue?.name,
        username: formValue?.username,
        email: formValue?.email,
        // phoneNumber: formValue?.phoneNumber,
      });
      try {
        const response = await service.client.usersPUT(userId as string, model);
      } catch (error) {
        console.log(error);
      }
    } else {
      toast({
        title: "Please input all required fields",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>My Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12">
          <div className="col-span-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 pb-2">
                  <span className="text-muted-foreground col-span-3">Name</span>
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 pb-2">
                  <span className="text-muted-foreground col-span-3">
                    Username
                  </span>
                  <div className="col-span-9">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 pb-2">
                  <span className="text-muted-foreground col-span-3">
                    Email
                  </span>
                  <div className="col-span-9">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* <div className="grid grid-cols-12 pb-2">
                  <span className="text-muted-foreground col-span-3">
                    Phone
                  </span>
                  <div className="col-span-9">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Phone Number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div> */}
              </form>
            </Form>
          </div>
          <div className="col-span-4 mx-auto flex flex-col items-center gap-4">
            <Image
              className="rounded-full"
              src={userData?.user?.image ?? ""}
              alt={userData?.user?.name ?? userData?.user?.email ?? ""}
              width={100}
              height={100}
            />
            <Button
              loading={isLoadingBtn}
              onClick={() => onSubmit()}
              variant="outline"
            >
              Change Avatar
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          loading={isLoadingBtn}
          onClick={() => onSubmit()}
          disabled={!form.formState.isValid || isLoadingBtn}
        >
          Change Information
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
