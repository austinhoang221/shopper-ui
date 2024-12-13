"use client";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ComponentType } from "react";
import React from "react";
import { redirect, useParams } from "next/navigation";

export default function withAuth(Component: React.ComponentType) {
  const ComponentWithAuth = () => {
    const params = useParams();
    const { status } = useSession();

    React.useEffect(() => {
      if (status === "unauthenticated") {
        const redirectUrl = `/${params.locale}/auth/login?from=user`;
        redirect(redirectUrl);
      }
      if (status === "loading") console.log("loading");
    }, [status]);

    return <Component />;
  };

  return ComponentWithAuth;
}
