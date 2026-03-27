import { cookies } from "next/headers";
import crypto from "node:crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const ADMIN_COOKIE_NAME = "admin_session";

function getPasswordHash(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function isAdminPasswordValid(password: string) {
  if (!ADMIN_PASSWORD) {
    console.warn("ADMIN_PASSWORD is not set");
    return false;
  }
  return getPasswordHash(password) === getPasswordHash(ADMIN_PASSWORD);
}

export function createAdminSessionCookie() {
  if (!ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD is not set");
  }

  const value = getPasswordHash(ADMIN_PASSWORD);

  return {
    name: ADMIN_COOKIE_NAME,
    value,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 8, // 8 horas
    },
  };
}

export function clearAdminSessionCookie() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    },
  };
}

export async function isRequestFromAdmin() {
  if (!ADMIN_PASSWORD) return false;

  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!cookie) return false;

  const expected = getPasswordHash(ADMIN_PASSWORD);
  return cookie.value === expected;
}
