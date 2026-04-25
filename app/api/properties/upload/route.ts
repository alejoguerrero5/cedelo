import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const bucketName =
  process.env.NEXT_PUBLIC_SUPABASE_PROPERTY_BUCKET || "property-images";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
    }

    const extension = file.name.split(".").pop() || "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const path = `properties/${safeName}`;

    const bytes = await file.arrayBuffer();
    const { error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(path, bytes, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(path);

    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error subiendo imagen",
      },
      { status: 500 },
    );
  }
}
