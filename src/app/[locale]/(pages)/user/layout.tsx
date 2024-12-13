"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Layout({ children }: A) {
  const params = useParams();
  const pathname = usePathname();
  const menuItems = [
    { label: "General", path: `/${params.locale}/user/profile` },
    {
      label: "Change Password",
      path: `/${params.locale}/user/change-password`,
    },
    { label: "Address", path: `/${params.locale}/user/address` },
    { label: "Orders", path: `/${params.locale}/user/orders` },
  ];
  return (
    <div className="grid grid-cols-12 mt-4 gap-4">
      <div className="col-span-2 pr-2 border-r-[1px]">
        <div className="flex gap-2"></div>
        <ul className="pt-5">
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
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-10">{children}</div>
    </div>
  );
}
