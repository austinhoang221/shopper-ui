import { NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages } from "./app/i18n/setting";
import { ulid } from "ulidx";
import { contentLanguageCookie, userIdCookie } from "./utils/constants";

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

  if (req.cookies.has(contentLanguageCookie))
    lng = acceptLanguage.get(req.cookies.get(contentLanguageCookie).value);
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!lng) lng = fallbackLng;
  if (!req.cookies.get(contentLanguageCookie)?.value)
    response.cookies.set(contentLanguageCookie, lng, {
      secure: true,
    });

  if (!req.cookies.get(userIdCookie)?.value) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    response.cookies.set(userIdCookie, ulid(), {
      secure: true,
      expires: expires,
    });
  }

  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL(`/${lng}`, req.url));
  }

  return response;
}
