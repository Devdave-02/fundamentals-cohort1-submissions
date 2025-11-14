import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

import { getCurrentProfile } from "./_lib/auth";

// const clearAuthCookies = (response: NextResponse) => {
//   response.cookies.delete("accessToken");
//   return response;
// };

const createRedirectResponse = (req: NextRequest, pathname: string) => {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.redirect(url);
  return response;
};

export const middleware = async (req: NextRequest) => {


  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return createRedirectResponse(req, "/login");
  }

  try {

   const profile = await getCurrentProfile(accessToken);

    if (!profile || !profile._id) {
      return createRedirectResponse(req, "/login");
    }
  
    
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", profile._id);
    requestHeaders.set("x-access-token", accessToken);


    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });


    return response;
  } catch (error) {
    console.error("Middleware authentication error:", error);
    return createRedirectResponse(req, "/login");
  }
};

export const config: MiddlewareConfig = {
  matcher: ["/products/:path*", "/cart/:path*"],
};
