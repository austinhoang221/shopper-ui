"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
// import { verifyGoogleToken } from "@/app/api/services/googleService";

const Authentication = () => {
  // const handleSuccess = async (response: A) => {
  //   try {
  //     const token = response.credential;
  //     const userData = await verifyGoogleToken(token);
  //     console.log("User info:", userData);
  //   } catch (error) {
  //     console.error("Error during Google login:", error);
  //   }
  // };
  const [userData, setUserData] = React.useState();

  React.useEffect(() => {
    const user = localStorage.getItem("user-context");
    try {
      setUserData(JSON.parse(user!));
    } catch {
      console.error("Error parsing user data");
    }
  }, []);
  const params = useParams();
  const onRenderUser = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="relative ">
          <FontAwesomeIcon
            icon={faUser}
            className="text-primary cursor-pointer"
            width={30}
            height={30}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-center">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
  const onRenderAuth = () => (
    <div className="flex min-w-24">
      <Link
        className="text-primary"
        href={`/${params.locale}/auth/login?callbackUrl=${encodeURIComponent(
          window.location.pathname
        )}`}
      >
        Login
      </Link>
      <span className="text-muted-foreground px-1">|</span>
      <Link className="text-primary" href={`/${params.locale}/auth/signup`}>
        Sign up
      </Link>
    </div>
  );
  return userData ? onRenderUser() : onRenderAuth();
};
export default Authentication;
