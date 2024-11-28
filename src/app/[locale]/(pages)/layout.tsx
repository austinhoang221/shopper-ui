import Header from "@/components/header/Header";
import React from "react";
import { service } from "@/app/api/services/service";
import { getCookie, hasCookie } from "cookies-next";
import { userIdCookie } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Layout({ children, params: { locale } }: A) {
  if (hasCookie(userIdCookie)) {
    await service.client.users(getCookie(userIdCookie)!);
  }
  return (
    <>
      <Header language={locale}></Header>
      {/* <Breadcrumb language={locale} /> */}
      <main className="container mx-auto px-2 md:px-0">
        <ScrollArea>{children}</ScrollArea>
      </main>
    </>
  );
}
