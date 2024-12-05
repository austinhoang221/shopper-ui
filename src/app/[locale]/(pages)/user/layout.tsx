"use client";
import { SessionProvider } from "next-auth/react";
import { useParams, useRouter, usePathname } from "next/navigation";

export default function Layout({ children }: A) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const menuItems = [
    { label: "General", path: `/${params.locale}/user/profile` },
    {
      label: "Change Password",
      path: `/${params.locale}/user/change-password`,
    },
    { label: "Address", path: `/${params.locale}/user/address` },
  ];
  return (
    <SessionProvider>
      <div className="grid grid-cols-12 mt-4">
        <div className="col-span-2 pr-2">
          <ul className="space-y-4 pt-5">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`w-full text-left border-r-4 ${
                    pathname === item.path
                      ? "font-bold border-[--primary] text-[--primary]"
                      : "border-transparent text-gray-700 hover:text-[--primary]"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-10">{children}</div>
      </div>
    </SessionProvider>
  );
}
