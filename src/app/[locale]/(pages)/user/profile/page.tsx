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
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z
    .string()
    .min(1, {
      message: "Email is required",
    })
    .email(),
  phoneNumber: z.string().trim().regex(PHONE_NUMBER_REGEX),
});
const UserInfo = () => {
  const { data: userData } = useSession();
  const [isLoadingBtn, setIsLoadingBtn] = React.useState<boolean>(false);
  const userId = getCookie(userIdCookie);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      phoneNumber: "",
      email: "",
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await service.client.usersGET(userId as string);
      // form.reset({
      //   firstName: data.firstName || "",
      //   lastName: data.lastName || "",
      //   username: data.username || "",
      //   phoneNumber: data.phoneNumber || "",
      //   email: data.email || "",
      // });
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const onSubmit = async () => {
    form.trigger();
    const formValue = form.getValues();
    console.log(formValue);
    const result = FormSchema.safeParse(formValue);

    if (result.success) {
      const model = UpdateUserRequest.fromJS({
        firstName: formValue?.firstName,
        lastName: formValue?.lastName,
        username: formValue?.username,
        email: formValue?.email,
        phoneNumber: formValue?.phoneNumber
      });

      await service.client.usersPUT(userId as string, model);
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
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="First Name ..." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1"></div>
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Last Name ..." {...field} />
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
                <div className="grid grid-cols-12 pb-2">
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
                </div>
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
              disabled={!form.formState.isValid || isLoadingBtn}
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
          disabled={!form.formState.isValid || isLoadingBtn}
          onClick={() => onSubmit()}
        >
          Change Information
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
