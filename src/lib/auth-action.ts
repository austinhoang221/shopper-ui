"use server";

import { signIn, signOut } from "@/auth";
import { userIdCookie } from "@/utils/constants";
import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import { ulid } from "ulidx";

export async function SignOut() {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  cookies().set({
    name: userIdCookie,
    value: ulid(),
    expires: expires,
    path: "/",
  });
  return await signOut({ redirect: true });
}

export async function SignInGoogle(callbackUrl: string) {
  await signIn("google", { redirectTo: callbackUrl });
}

export async function SignIn(callbackUrl: string, formData: A) {
  try {
    await signIn("credentials", formData, { redirectTo: callbackUrl });
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return { error: "Email/Phone number or Password incorrect" };
        default:
          return { error: "Something went wrong" };
      }
    }

    throw error;
  }
}
