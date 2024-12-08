"use client";
import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
  onResend: () => Promise<void>;
  email: string;
  content: string;
};
const EmailVerification = (props: Props) => {
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
    await props.onResend();
    setCountDown(60);
    runHeartBeat();
  };
  return (
    <div className="">
      <h1 className="text-xl font-semibold mb-2">Email Sent!</h1>
      <p>
        We&apos;ve sent a verification email to{" "}
        <span className="font-semibold">
          {decodeURIComponent(props?.email as string)}
        </span>
      </p>
      <p className="mb-2">{props.content}</p>
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
  );
};

export default EmailVerification;
