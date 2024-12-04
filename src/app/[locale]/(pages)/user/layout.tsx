import { SessionProvider } from "next-auth/react";

export default async function Layout({ children }: A) {
  return (
    <SessionProvider>
      <div className="grid grid-cols-12 mt-4">
        <div className="col-span-2"></div>
        <div className="col-span-10">{children}</div>
      </div>
    </SessionProvider>
  );
}
