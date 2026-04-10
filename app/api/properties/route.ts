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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (body.title !== undefined) updates.title = body.title;
  if (body.city !== undefined) updates.city = body.city;
  if (body.neighborhood !== undefined) updates.neighborhood = body.neighborhood;
  if (body.originalPrice !== undefined)
    updates.original_price = body.originalPrice;
  if (body.currentPrice !== undefined)
    updates.current_price = body.currentPrice;
  if (body.area !== undefined) updates.area = body.area;
  if (body.bedrooms !== undefined) updates.bedrooms = body.bedrooms;
  if (body.bathrooms !== undefined) updates.bathrooms = body.bathrooms;
  if (body.type !== undefined) updates.type = body.type;
  if (body.deliveryDate !== undefined)
    updates.delivery_date = body.deliveryDate;
  if (body.images !== undefined) updates.images = body.images;
  if (body.isVIS !== undefined) updates.is_vis = Boolean(body.isVIS);
  if (body.status !== undefined) updates.status = body.status;
  if (typeof body.is_deleted === "boolean")
    updates.is_deleted = body.is_deleted;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Nada para actualizar" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("properties")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

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
