import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import React from "react";
import Breadcrumb from "@/components/header/Breadcrumb";
import { Toaster } from "@/components/ui/toaster";
import { service } from "@/api/services/service";
import { getCookie, hasCookie } from "cookies-next";
import { userIdCookie } from "@/utils/constants";

export const metadata: Metadata = {
  title: "Shopper",
  description: "Generated by create next app",
};

export default async function Layout({ children, params: { locale } }: A) {
  if (hasCookie(userIdCookie)) {
    await service.client.users(getCookie(userIdCookie)!);
  }
  return (
    <>
      <Header language={locale}></Header>
      {/* <Breadcrumb language={locale} /> */}
      <Toaster />
      <main className="container mx-auto px-2 md:px-0">{children}</main>
      <Footer></Footer>
    </>
  );
}
