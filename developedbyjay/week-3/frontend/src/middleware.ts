import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "./lib/auth";

const createRedirectResponse = (req: NextRequest, pathname: string) => {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.redirect(url);
  return response;
};

export const middleware = async (req: NextRequest) => {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return createRedirectResponse(req, "/sign-in");
  }

  try {
    const profile = await getCurrentProfile(accessToken);

    if (!profile || !profile._id) {
      return createRedirectResponse(req, "/sign-in");
    }

    const requestHeaders = new Headers(req.headers);
    
    requestHeaders.set("x-user-id", profile._id);
    requestHeaders.set("x-access-token", accessToken);
    requestHeaders.set("x-userRole", profile.role);

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
};

export const config: MiddlewareConfig = {
  matcher: ["/task-manager/:path*", "/schedule-task/:path*"],
};
