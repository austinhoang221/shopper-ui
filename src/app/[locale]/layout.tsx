import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SearchBox from "@/components/header/SearchBox";
import React from "react";
import Breadcumb from "@/components/header/Breadcrumb";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function Layout({ children, params: { locale } }: A) {
  return (
    <>
      <Header language={locale}></Header>
      <SearchBox className="block md:hidden px-2" />
      <Breadcumb language={locale} />
      <main className="container mx-auto px-2 md:px-0">{children}</main>
      <Footer></Footer>
    </>
  );
}
