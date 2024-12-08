"use client";
import { service } from "@/app/api/services/service";
import EmailVerification from "@/components/email-verification/EmailVerification";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const EmailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onResend = async () => {
    await service.client.resendConfirmedEmail(
      decodeURIComponent(params?.email as string),
      callbackUrl ?? ""
    );
  };
  return (
    <div className="bg-primary flex justify-center">
      <div className="max-w-screen-xl m-10 bg-primary sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 sm:p-12 bg-white p-6 rounded-sm shadow-sm">
          <EmailVerification
            email={(params?.email as string) ?? ""}
            onResend={onResend}
            content=" Please check your inbox and follow the instructions to activate your
        account. If you don't see the email, please check your spam or junk
        folder."
          />
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
