"use client";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { SignIn } from "@/lib/auth-action";

type Props = {
  callBackUrl: string;
};
const GoogleAuth = (props: Props) => {
  const handleGoogleLogin = async () => {
    await SignIn(props.callBackUrl);
  };
  return (
    <div>
      <Button
        onClick={() => handleGoogleLogin()}
        className="flex items-center justify-center w-full py-4 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-grey-300 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300"
      >
        <Image
          className="h-5 mr-2"
          src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
          alt=""
          width={20}
          height={20}
        />
        Sign in with Google
      </Button>
    </div>
  );
};

export default GoogleAuth;
