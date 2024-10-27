import { NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { cookieName, fallbackLng, languages } from "./app/i18n/setting";
import { ulid } from "ulidx";

acceptLanguage.languages(languages);

export const config = {
  // matcher: '/:lng*'
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
  ],
};

export function middleware(req: A) {
  let lng;
  const response = NextResponse.next();

  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName).value);
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!lng) lng = fallbackLng;
  if (!req.cookies.get(cookieName)?.value)
    response.cookies.set(cookieName, lng, {
      secure: true,
    });

  if (!req.cookies.get("user-id")?.value) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    response.cookies.set("user-id", ulid(), { secure: true, expires: expires });
  }

  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL(`/${lng}`, req.url));
  }

  return response;
}
