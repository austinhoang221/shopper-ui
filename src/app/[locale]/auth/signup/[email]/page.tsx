"use client";
import { service } from "@/app/api/services/service";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import React from "react";

const EmailVerification = () => {
  const params = useParams();
  const [countDown, setCountDown] = React.useState<number>(60);
  const id = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const clear = () => {
    clearInterval(id.current);
  };

  React.useEffect(() => {
    runHeartBeat();
    return () => {
      clear();
    };
  }, []);

  React.useEffect(() => {
    if (countDown <= 0) clear();
  }, [countDown]);

  const runHeartBeat = () => {
    id.current = setInterval(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);
  };

  const onResend = async () => {
    await service.client.resendConfirmedEmail(
      params?.email as string,
      `/${params?.locale}/auth/login`
    );
    setCountDown(60);
    runHeartBeat();
  };
  return (
    <div className="bg-primary flex justify-center">
      <div className="max-w-screen-xl m-10 bg-primary sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 sm:p-12 bg-white p-6 rounded-sm shadow-sm">
          <h1 className="text-xl font-semibold mb-2">Email Sent!</h1>
          <p>
            We&apos;ve sent a verification email to{" "}
            <span className="font-semibold">
              {decodeURIComponent(params?.email as string)}
            </span>
          </p>
          <p className="mb-2">
            Please check your inbox and follow the instructions to activate your
            account. If you don&apos;t see the email, please check your spam or
            junk folder.
          </p>
          <span className="text-muted-foreground my-2">
            Didn&apos;t receive the email?
          </span>
          <br></br>
          <Button
            className="w-36 mt-2"
            disabled={countDown !== 0}
            onClick={() => onResend()}
          >
            Resend email &nbsp; {countDown !== 0 && <span>({countDown})</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
