import { NextResponse } from "next/server";
import { createAdminSessionCookie, isAdminPasswordValid } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (typeof password !== "string") {
      return NextResponse.json(
        { message: "Contraseña inválida" },
        { status: 400 },
      );
    }

    if (!isAdminPasswordValid(password)) {
      return NextResponse.json(
        { message: "Credenciales incorrectas" },
        { status: 401 },
      );
    }

    const cookie = createAdminSessionCookie();

    const response = NextResponse.json({ message: "Autenticado" });
    response.cookies.set(cookie.name, cookie.value, cookie.options);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error al iniciar sesión" },
      { status: 500 },
    );
  }
}

