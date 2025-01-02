"use server";

import { signIn, signOut } from "@/auth";
import { authorizationCookie, userIdCookie } from "@/utils/constants";
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
  cookies().delete(authorizationCookie);
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

export async function getPayPalAccessToken() {
  const { NEXT_PUBLIC_PAYPAL_CLIENT_ID, NEXT_PUBLIC_PAYPAL_CLIENT_SECRET } =
    process.env;
  const url = "https://api-m.sandbox.paypal.com/v1/oauth2/token";

  const encodedToken = Buffer.from(
    `${NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${NEXT_PUBLIC_PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const authResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: "Basic " + encodedToken,
    },
    body: "grant_type=client_credentials",
  });
  const { access_token } = await authResponse.json();
  return access_token;
}
