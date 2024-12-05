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
const Address = () => {
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
        <CardTitle>My Address</CardTitle>
      </CardHeader>
      <CardContent>
        <div>hehe</div>
      </CardContent>
    </Card>
  );
};

export default Address;
