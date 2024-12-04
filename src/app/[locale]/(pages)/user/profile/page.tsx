"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { PHONE_NUMBER_REGEX } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const FormSchema = z.object({
  name: z.string(),
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
    },
  });

  const onSubmit = () => {};
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>My Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12">
          <div className="grid-cols-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="gap-4">
                          <FormControl className="col-span-1">
                            <Input placeholder="Name" {...field} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Username</span>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <div className="gap-4">
                          <FormControl className="col-span-1">
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="gap-4">
                          <FormControl className="col-span-1">
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>
          <div className="grid-cols-4 mx-auto">
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
              Login
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          loading={isLoadingBtn}
          disabled={!form.formState.isValid || isLoadingBtn}
          onClick={() => onSubmit()}
        >
          Login
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
