import {NextRequest, NextResponse } from "next/server";
import apiRequest from "./lib/axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

const routes = {
  admin: [
    "/admin",
  ],
  protected:[
    "/profile",
    "/campsite"
  ],
  public:[
    "/login",
    "/register",
    "/"
  ]
}

const getIsAuth = async (token: RequestCookie, admin: boolean): Promise<boolean> => {
  apiRequest.defaults.headers.common['Authorization'] = `Token ${token.value}`;
  const {data: profile} = await apiRequest.get('auth/profile');
  if (admin) {
    if (profile.is_admin) {
      return true
    }
    return false
  }
  return profile.username !== ""
};


export default async function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  const path = req.nextUrl.pathname
  const isProtectedRoute = routes.protected.some((route)=> path === route || path.startsWith(route+"/"))
  const isAdminRoute = routes.admin.some((route)=> path === route || path.startsWith(route+"/"))
  

  if (isAdminRoute) {
    if (await getIsAuth(token, true)) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  } else if (isProtectedRoute) { 
    if (await getIsAuth(token, false)) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  return NextResponse.next()
}
