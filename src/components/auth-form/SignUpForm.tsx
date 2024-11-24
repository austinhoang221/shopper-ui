"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { SeparatorWithText } from "../ui/separator-text";
import GoogleAuth from "./GoogleAuth";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import Link from "next/link";

const FormSchema = z.object({
  username: z.string().trim().min(1),
});
type Props = {
  callBackUrl: string;
};
const SignUpForm = (props: Props) => {
  const params = useParams();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async () => {
    form.trigger();
    const formValue = form.getValues();
    const result = FormSchema.safeParse(formValue);
    if (result.success) {
      console.log(formValue);
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
          <div></div>
        </form>
        <Button
          type="submit"
          disabled={!FormSchema.safeParse(form.getValues())?.success}
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
