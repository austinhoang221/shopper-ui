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

type Props = {
  callBackUrl: string;
};
const FormSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
});
const LoginForm = (props: Props) => {
  const router = useRouter();
  const params = useParams();
  console.log(params);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    form.trigger();
    const formValue = form.getValues();
    const result = FormSchema.safeParse(formValue);
    if (result.success) {
      router.push(props.callBackUrl);
    }
  };

  return (
    <div className="grid gap-4 py-4">
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
                      <Input
                        placeholder="Email/Phone number/User name"
                        {...field}
                      />
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
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                );
              }}
            />
          </div>
        </form>
        <div className="text-right opacity-60">Forgot Password?</div>
        <Button
          type="submit"
          disabled={!FormSchema.safeParse(form.getValues())?.success}
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
          href={`/${params?.locale}/auth/signup`}
          className="text-primary hover:underline cursor-pointer"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
