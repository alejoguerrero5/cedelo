// /app/api/contact/route.ts

import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, phone, city, projectType, isVIS, terms } = body;

    const { error } = await supabase
      .from("leads")
      .insert([{ name, email, phone, city, projectType, isVIS, terms }]);

    if (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Error guardando lead" }), {
        status: 500,
      });
    }

    console.log("Lead guardado en DB");
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error en la API" }), {
      status: 500,
    });
  }
}
