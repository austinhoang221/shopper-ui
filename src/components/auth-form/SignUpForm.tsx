"use client";

import React from "react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { SeparatorWithText } from "../ui/separator-text";
import GoogleAuth from "./GoogleAuth";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  PASSWORD_REGEX,
  PHONE_NUMBER_REGEX,
  userIdCookie,
} from "@/utils/constants";
import { service } from "@/app/api/services/service";
import {
  UserCheckEmailExistRequest,
  UserRegisterRequest,
} from "@/app/api/services/api";
import { getCookie } from "cookies-next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";

const FormSchema = z
  .object({
    username: z.union([
      z.string().email(),
      z.string().trim().regex(PHONE_NUMBER_REGEX),
    ]),
    password: z.string().trim().regex(PASSWORD_REGEX),
    confirmPassword: z.string().trim().min(1),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password did not match",
        path: ["confirmPassword"],
      });
    }
  });
type Props = {
  callBackUrl: string;
};

const SignUpForm = (props: Props) => {
  const params = useParams();
  const router = useRouter();
  const userId = getCookie(userIdCookie);
  const [isLoadingBtn, setIsLoadingBtn] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onNavigateToEmailVerify = async () => {
    const formValue = form.getValues();
    setIsLoadingBtn(true);
    const isValid = await service.client.checkEmailExist(
      UserCheckEmailExistRequest.fromJS({ email: formValue.username })
    );
    if (!isValid?.isExist) {
      await service.client.register(
        UserRegisterRequest.fromJS({
          id: userId,
          email: formValue.username,
          password: formValue.password,
          confirmPassword: formValue.confirmPassword,
          returnUrl: props.callBackUrl,
        })
      );
      setIsLoadingBtn(false);
      router.push(`/${params.locale}/auth/signup/${formValue.username}`);
    } else {
      setErrorMsg("Email is already taken, please choose another one");
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
        <form>
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

          <div className="mb-3">
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
          <div className="mb-3">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="gap-4">
                      <FormControl className="col-span-1">
                        <Input
                          type="password"
                          placeholder="Confirm password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />
          </div>
        </form>
        <Button
          type="submit"
          loading={isLoadingBtn}
          disabled={!form.formState.isValid || isLoadingBtn}
          onClick={() => onNavigateToEmailVerify()}
        >
          Continue
        </Button>
      </Form>

      <SeparatorWithText>Or, log in with</SeparatorWithText>

      <GoogleAuth callBackUrl={props.callBackUrl} />

      <div>
        <span className="text-muted-foreground">
          Already have an account?&nbsp;
        </span>
        <Link
          href={`/${params?.locale}/auth/login`}
          className="text-primary hover:underline cursor-pointer"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
