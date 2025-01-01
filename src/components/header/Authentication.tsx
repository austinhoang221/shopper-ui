"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SignOut } from "@/lib/auth-action";
import { Skeleton } from "../ui/skeleton";

const Authentication = () => {
  const { data: userData, status } = useSession();
  const [pathname, setPathname] = React.useState<string>("");
  const router = useRouter();
  React.useEffect(() => {
    const path = window.location.pathname;
    try {
      setPathname(path);
    } catch {
      console.error("Error parsing user data");
    }
  }, []);
  const params = useParams();
  const onRenderUser = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {userData?.user?.photoUrl ? (
          <Image
            className="rounded-full"
            src={userData?.user?.photoUrl}
            alt={userData?.user?.name ?? userData?.user?.photoUrl}
            width={30}
            height={30}
          ></Image>
        ) : (
          <FontAwesomeIcon
            icon={faUser}
            className="text-primary cursor-pointer"
            width={30}
            height={30}
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.locale}/user/profile`)}
          >
            My Account
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.locale}/user/orders`)}
          >
            My Orders
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await SignOut();
            location.reload();
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  const onRenderAuth = () => (
    <div className="flex min-w-24">
      <Link
        className="text-primary"
        href={`/${params.locale}/auth/login?callbackUrl=${encodeURIComponent(
          pathname
        )}`}
      >
        Login
      </Link>
      <span className="text-muted-foreground px-1">|</span>
      <Link
        className="text-primary"
        href={`/${params.locale}/auth/signup?callbackUrl=${encodeURIComponent(
          pathname
        )}`}
      >
        Sign up
      </Link>
    </div>
  );
  return status === "loading" ? (
    <Skeleton className="h-6 w-16 bg-gray-200" />
  ) : userData ? (
    onRenderUser()
  ) : (
    onRenderAuth()
  );
};
export default Authentication;
