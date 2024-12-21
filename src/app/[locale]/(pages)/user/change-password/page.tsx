"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { service } from "@/app/api/services/service";
import { toast } from "@/components/hooks/use-toast";
import { UserChangePasswordRequest } from "@/app/api/services/api";
import { PASSWORD_REGEX, userIdCookie } from "@/utils/constants";
import withAuth from "@/hoc/Auth";
import { getCookie } from "cookies-next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const FormSchema = z
  .object({
    oldPassword: z.string().trim().regex(PASSWORD_REGEX),
    newPassword: z.string().trim().regex(PASSWORD_REGEX),
    confirmPassword: z.string().trim().regex(PASSWORD_REGEX),
  })
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Password did not match",
        path: ["confirmPassword"],
      });
    }
  });
const ChangePass = () => {
  const [isLoadingBtn, setIsLoadingBtn] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async () => {
    const formValue = form.getValues();
    const result = FormSchema.safeParse(formValue);
    setIsLoadingBtn(true);
    const userId = getCookie(userIdCookie);
    if (result.success && userId) {
      const model = UserChangePasswordRequest.fromJS({
        oldPassword: formValue?.oldPassword,
        newPassword: formValue?.newPassword,
        newConfirmPassword: formValue?.confirmPassword,
      });
      try {
        await service.client.changePassword(userId, model);
      } catch {
        setErrorMsg("Old password is not correct");
      } finally {
        setIsLoadingBtn(false);
      }
    } else {
      toast({
        title: "Please input all required fields",
        variant: "destructive",
      });
      setIsLoadingBtn(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        {errorMsg && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 pb-2">
                  <span className="text-muted-foreground col-span-3">
                    Old Password
                  </span>
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

export default withAuth(ChangePass);
