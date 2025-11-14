import { NextRequest, NextResponse } from "next/server";

const createRedirectResponse = (req: NextRequest, pathname: string) => {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.redirect(url);
  return response;
};

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return createRedirectResponse(req, "/sign-in");
  }

  try {
    const requestHeaders = new Headers(req.headers);

    requestHeaders.set("x-access-token", accessToken);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    console.error("Middleware authentication error:", error);
    return createRedirectResponse(req, "/sign-in");
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
