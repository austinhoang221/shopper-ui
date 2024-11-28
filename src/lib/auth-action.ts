"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function SignOut() {
  return await signOut({ redirect: true });
}

export async function SignInGoogle(callbackUrl: string) {
  return await signIn("google", { redirectTo: callbackUrl });
}

export async function SignIn(callbackUrl: string, formData: A) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email/Phone number or Password incorrect" };
        default:
          return { error: "Something went wrong" };
      }
    }

    throw error;
  }
}
