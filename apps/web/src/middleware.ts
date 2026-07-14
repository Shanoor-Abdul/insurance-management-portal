import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const supportedLngs = ["en", "ar"];
const defaultLng = "en";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = supportedLngs.every(
    (lng) => !pathname.startsWith(`/${lng}/`) && pathname !== `/${lng}`
  );

  if (pathnameIsMissingLocale) {
    const locale = request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] || defaultLng;
    const finalLocale = supportedLngs.includes(locale) ? locale : defaultLng;
    return NextResponse.redirect(new URL(`/${finalLocale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\..*).*)"]
};
