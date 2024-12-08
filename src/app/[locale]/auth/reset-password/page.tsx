"use client";
import { UserResetPasswordRequest } from "@/app/api/services/api";
import { service } from "@/app/api/services/service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { PASSWORD_REGEX } from "@/utils/constants";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const FormSchema = z
  .object({
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
const ResetPassword = () => {
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async () => {
    if (form.formState.isValid) {
      try {
        await service.client.resetPassword(
          UserResetPasswordRequest.fromJS({
            email: email,
            newPassword: form.getValues().newPassword,
            newConfirmPassword: form.getValues().confirmPassword,
            resetPasswordToken: token,
          })
        );
        router.push(`/${params?.locale}/auth/login`);
      } catch (errors: A) {
        setErrorMsg(errors?.errors?.[0]?.message);
      }
    } else {
      toast({
        title: "Please input all required fields",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4  flex justify-center items-center">
      <Card className="mx-auto max-w-screen-md min-w-[60vh]  sm:rounded-lg justify-center ">
        <CardHeader>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faArrowLeft}
              width={20}
              height={20}
              className="text-primary cursor-pointer"
              onClick={() => router.push(`/${params?.locale}/auth/login`)}
            />
            <h2 className="text-center w-full text-xl">Config Password</h2>
          </div>
        </CardHeader>
        <CardContent className="pb-14 px-12 pt-4">
          <>
            {errorMsg && (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4 " />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}
            {/* <div className="text-center">Create new password for</div>
            <div className="text-center mb-2">{email}</div> */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <div className="gap-4">
                          <FormControl className="col-span-1">
                            <Input
                              type="password"
                              placeholder="New password"
                              {...field}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <div className="gap-4">
                          <FormControl className="col-span-1">
                            <Input
                              type="password"
                              placeholder="Confirm password"
                              {...field}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
            <p className="text-muted-foreground mt-2">
              At least one normal character
            </p>
            <p className="text-muted-foreground mt-2">
              At least one uppercase character
            </p>
            <p className="text-muted-foreground mt-2">At least 9 characters</p>
            <p className="text-muted-foreground mt-2">
              At least one special character
            </p>
            <IconButton
              className="w-full p-4 mt-2"
              onClick={() => onSubmit()}
              variant="expandIcon"
              Icon={ArrowRightIcon}
              iconPlacement="right"
              disabled={!form.formState.isValid}
            >
              Next
            </IconButton>
          </>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
