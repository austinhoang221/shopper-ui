"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  faFileLines,
  faLocationDot,
  faLocationPin,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Layout({ children }: A) {
  const params = useParams();
  const pathname = usePathname();
  const { data: userData, status } = useSession();
  const menuItems = [
    {
      icon: faUser,
      label: "General",
      path: `/${params.locale}/user/profile`,
    },
    {
      icon: faLock,
      label: "Change Password",
      path: `/${params.locale}/user/change-password`,
    },
    {
      icon: faLocationDot,
      label: "Address",
      path: `/${params.locale}/user/address`,
    },
    {
      icon: faFileLines,
      label: "Orders",
      path: `/${params.locale}/user/orders`,
    },
  ];
  return (
    <div className="grid grid-cols-12 mt-4 gap-4">
      <div className="hidden md:block col-span-2 pr-2 border-r-[1px]">
        <div>
          {status === "loading" ? (
            <Skeleton className="h-6 w-w-3/4 bg-gray-200" />
          ) : (
            <div className="flex gap-2">
              <Image
                className="rounded-full"
                src={userData?.user?.photoUrl ?? ""}
                alt={userData?.user?.name ?? userData?.user?.photoUrl ?? ""}
                width={30}
                height={30}
              ></Image>
              <span>{userData?.user?.username}</span>
            </div>
          )}
          <ul className="pt-2">
            {menuItems.map((item) => (
              <li key={item.path} className="my-1">
                <Link
                  href={item.path}
                  className={`w-full block text-left rounded-md hover:text-primary  p-2 ${
                    pathname === item.path
                      ? "font-bold bg-secondary text-primary"
                      : "border-transparent hover:bg-secondary text-gray-700 hover:text-primary"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-primary mr-2"
                  />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-span-12 md:col-span-10">
        <div className="flex md:hidden  gap-2">
          <Image
            className="rounded-full"
            src={userData?.user?.photoUrl ?? ""}
            alt={userData?.user?.name ?? userData?.user?.photoUrl ?? ""}
            width={30}
            height={30}
          ></Image>
          <span>{userData?.user?.username}</span>
        </div>
        <ul className="pt-2 flex md:hidden mb-2">
          {menuItems.map((item) => (
            <li key={item.path} className="mx-1">
              <Link
                href={item.path}
                className={`w-full block text-left rounded-md hover:text-primary  p-2 ${
                  pathname === item.path
                    ? "font-bold bg-secondary text-primary"
                    : "border-transparent hover:bg-secondary text-gray-700 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ScrollArea>{children}</ScrollArea>
      </div>
    </div>
  );
}
