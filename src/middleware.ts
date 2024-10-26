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
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName).value);
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!lng) lng = fallbackLng;
  if (!lng)
    NextResponse.next().cookies.set(cookieName, lng, {
      secure: true,
      httpOnly: true,
    });
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL(`/${lng}`, req.url));
  }
  const response = NextResponse.next();

  if (!req.cookies.get("user-id")?.value) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    response.cookies.set("user-id", ulid(), { secure: true, expires: expires });
  }
  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer"));
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    if (lngInReferer)
      response.cookies.set(cookieName, lngInReferer, {
        secure: true,
      });
  }

  return response;
}
