"use server";

import { signIn } from "@/auth";

export async function SignIn(callbackUrl: string) {
  return await signIn("google", { redirectTo: callbackUrl });
}
