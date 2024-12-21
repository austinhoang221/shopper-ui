"use client";
import React from "react";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SeparatorWithText } from "../ui/separator-text";
import GoogleAuth from "./GoogleAuth";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SignIn } from "@/lib/auth-action";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { PASSWORD_REGEX } from "@/utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

type Props = {
  callBackUrl: string;
};
const FormSchema = z.object({
  username: z.string().email(),
  password: z.string().trim().regex(PASSWORD_REGEX),
});
const LoginForm = (props: Props) => {
  const router = useRouter();
  const params = useParams();
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [isLoadingBtn, setIsLoadingBtn] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    await form.trigger();
    setErrorMsg("");
    const formValue = form.getValues();
    const result = FormSchema.safeParse(formValue);
    if (result.success) {
      setIsLoadingBtn(true);
      const response = await SignIn(props.callBackUrl, { ...formValue });
      if (response?.error) {
        setErrorMsg(response?.error);
      } else {
        router.push(props.callBackUrl);
      }
      setIsLoadingBtn(false);
    } else {
      setIsLoadingBtn(false);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {errorMsg && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="gap-4">
                    <FormControl className="col-span-1">
                      <Input placeholder="Email/Phone number" {...field} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="gap-4">
                      <FormControl className="col-span-1">
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                          endContent={
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    className="text-primary"
                                  />
                                </TooltipTrigger>
                                <TooltipContent align="start">
                                  The password must be 6 characters long and
                                  include at least one uppercase letter (A-Z),
                                  one numeric digit (0-9), and one special
                                  character.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          }
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                );
              }}
            />
          </div>
        </form>
        <Link href="forgot-password" className="text-right opacity-60">
          Forgot Password?
        </Link>
        <Button
          type="submit"
          loading={isLoadingBtn}
          disabled={!form.formState.isValid || isLoadingBtn}
          onClick={() => onSubmit()}
        >
          Login
        </Button>
        <SeparatorWithText>Or, log in with</SeparatorWithText>
      </Form>

      <GoogleAuth callBackUrl={props.callBackUrl} />

      <div>
        <span className="text-muted-foreground">
          Don&#39;t have an account?&nbsp;
        </span>
        <Link
          href={`/${params?.locale}/auth/signup?callBackUrl=${props.callBackUrl}`}
          className="text-primary hover:underline cursor-pointer"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
