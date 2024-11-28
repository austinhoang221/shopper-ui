"use client";

import LoginForm from "@/components/auth-form/LoginForm";
import { useSearchParams } from "next/navigation";
import React from "react";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  return (
    <div className="bg-primary flex justify-center">
      <div className="max-w-screen-xl m-10 bg-primary sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 sm:p-12 bg-white p-6 rounded-sm shadow-sm">
          <h1 className="text-xl font-semibold">Login</h1>
          <LoginForm callBackUrl={callbackUrl ?? ""} />
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <p className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat">
            LOGO
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
