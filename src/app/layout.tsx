import type { Metadata } from "next";

import "./globals.css";
import { languages } from "./i18n/setting";
import { Inter } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { cn } from "@/lib/utils";
import StoreProvider from "./store/storeProvider";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Shopper",
  description: "Ecommerce shop",
};
export async function generateStaticParams() {
  return languages.map((lng) => ({ locale: lng }));
}

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default function RootLayout({ children, params: { lng } }: A) {
  return (
    <html lang={lng}>
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
