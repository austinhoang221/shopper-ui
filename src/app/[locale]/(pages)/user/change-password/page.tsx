"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { userIdCookie } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { service } from "@/app/api/services/service";
import { getCookie } from "cookies-next";
import { toast } from "@/components/hooks/use-toast";

const FormSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
});
const ChangePass = () => {
  const { data: userData } = useSession();
  const [isLoadingBtn, setIsLoadingBtn] = React.useState<boolean>(false);
  const userId = getCookie(userIdCookie);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async () => {
    form.trigger();
    const formValue = form.getValues();
    console.log(formValue);
    const result = FormSchema.safeParse(formValue);

    if (result.success) {
    //   const model = UpdateUserRequest.fromJS({
    //     oldPassword: formValue?.oldPassword,
    //     newPassword: formValue?.newPassword,
    //     confirmPassword: formValue?.confirmPassword
    //   });

    //   await service.client.usersPUT(userId as string, model);
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
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12">
          <div className="col-span-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 pb-2">
                  <span className="text-muted-foreground col-span-3">Old Password</span>
                  <div className="col-span-9">
                    <FormField
                      control={form.control}
                      name="oldPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 pb-2">
                  <span className="text-muted-foreground col-span-3">
                    New Password
                  </span>
                  <div className="col-span-9">
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 pb-2">
                  <span className="text-muted-foreground col-span-3">
                    Confirm Password
                  </span>
                  <div className="col-span-9">
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <Button
          type="submit"
          loading={isLoadingBtn}
          disabled={!form.formState.isValid || isLoadingBtn}
          onClick={() => onSubmit()}
        >
          Change Password
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChangePass;
