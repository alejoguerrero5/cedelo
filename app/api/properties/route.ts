import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "en-venta")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    title,
    city,
    neighborhood,
    originalPrice,
    currentPrice,
    area,
    bedrooms,
    bathrooms,
    type,
    deliveryDate,
    images,
    isVIS,
    status,
  } = body;

  if (!title || !city) {
    return NextResponse.json(
      { error: "Título y ciudad son requeridos" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.from("properties").insert([
    {
      title,
      city,
      neighborhood,
      original_price: originalPrice ?? null,
      current_price: currentPrice ?? null,
      area: area ?? null,
      bedrooms: bedrooms ?? null,
      bathrooms: bathrooms ?? null,
      type,
      delivery_date: deliveryDate || null,
      images: images ?? [],
      is_vis: Boolean(isVIS),
      status: status || "en-venta",
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data?.[0] ?? null, { status: 201 });
}
