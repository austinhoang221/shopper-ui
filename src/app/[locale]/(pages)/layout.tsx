import Header from "@/components/header/Header";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SessionProvider } from "next-auth/react";

export default async function Layout({ children, params: { locale } }: A) {
  return (
    <SessionProvider refetchInterval={30} refetchOnWindowFocus={false}>
      <Header language={locale}></Header>
      {/* <Breadcrumb language={locale} /> */}
      <main className="container mx-auto px-2 md:px-0">
        <ScrollArea>{children}</ScrollArea>
      </main>
    </SessionProvider>
  );
}
