import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth";

export async function POST() {
  const cookie = clearAdminSessionCookie();
  const response = NextResponse.json({ message: "Sesión cerrada" });
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}

