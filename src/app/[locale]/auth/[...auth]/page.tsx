"use client";

import LoginForm from "@/components/auth-form/LoginForm";
import SignUpForm from "@/components/auth-form/SignUpForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const AuthPage = ({
  params,
}: Readonly<{
  params: { auth: string };
}>) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  return (
    <>
      <nav className=" w-full px-2 bg-white/90 sticky top-0 z-40 backdrop-blur-sm border-b flex-none transition-colors duration-500  ">
        <Link href="/" className="mr-4">
          <h1 className="font-bold text-xl text-inherit">LOGO</h1>
        </Link>
      </nav>
      <div className="min-h-screen bg-primary flex justify-center">
        <div className="max-w-screen-xl m-10 bg-primary sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 sm:p-12 bg-white p-6 rounded-sm shadow-sm">
            {params?.auth?.[0] === "login" ? (
              <>
                <h1 className="text-xl font-semibold">Login</h1>
                <LoginForm callBackUrl={callbackUrl ?? ""} />
              </>
            ) : (
              <>
                <h1 className="text-xl font-semibold">Sign Up</h1>
                <SignUpForm callBackUrl={callbackUrl ?? ""} />
              </>
            )}
          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <p className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat">
              LOGO
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
