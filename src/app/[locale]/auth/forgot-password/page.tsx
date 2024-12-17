"use client";
import { service } from "@/app/api/services/service";
import EmailVerification from "@/components/email-verification/EmailVerification";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const FormSchema = z.object({
  email: z.string().email(),
});
const ForgotPassword = () => {
  const [isSendEmail, setIsSendEmail] = React.useState(false);
  const router = useRouter();
  const params = useParams();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async () => {
    await service.client.requestResetPassword(form.getValues().email);
    setIsSendEmail(true);
  };

  const onResend = async () => {
    await service.client.resendResetPasswordEmail(form.getValues().email);
  };

  return (
    <div className="mt-4 container flex justify-center items-center">
      <Card className="mx-auto max-w-screen-md min-w-96  sm:rounded-lg justify-center ">
        <CardHeader>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faArrowLeft}
              width={20}
              height={20}
              className="text-primary cursor-pointer"
              onClick={() => router.push(`/${params?.locale}/auth/login`)}
            />
            <h2 className="text-center w-full text-xl">Reset password</h2>
          </div>
        </CardHeader>
        <CardContent className="pb-14 px-12 pt-4">
          {isSendEmail ? (
            <>
              <div className="flex justify-center flex-1 text-center">
                <EmailVerification
                  email={form.getValues().email}
                  onResend={onResend}
                  content=" Please check your inbox and follow the instructions to reset your password. 
                  If you don't see the email, please check your spam or junk
        folder."
                />
              </div>
            </>
          ) : (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="mb-3">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
