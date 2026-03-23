// /app/api/contact/route.ts

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, phone, city, projectType, isVIS, terms } = body;

    console.log("Nuevo lead:", {
      name,
      email,
      phone,
      city,
      projectType,
      isVIS,
      terms,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error en la API" }), {
      status: 500,
    });
  }
}
