import { supabase } from "@/lib/supabase";
import { mapDbPropertyToProperty } from "@/lib/propertyMapper";
import { NextResponse } from "next/server";

function normalizeImages(images: unknown): string[] {
  if (Array.isArray(images)) {
    return images
      .map((value) => String(value).trim())
      .filter((value) => value.length > 0);
  }

  if (typeof images === "string") {
    return images
      .split(/[\n,]/)
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
  }

  return [];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data ?? []).map(mapDbPropertyToProperty), {
    status: 200,
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    projectName,
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
    leadId,
  } = body;

  if (!projectName || !city) {
    return NextResponse.json(
      { error: "Nombre del proyecto y ciudad son requeridos" },
      { status: 400 },
    );
  }

  const payload = {
    project_name: projectName,
    city,
    neighborhood,
    original_price: originalPrice ?? null,
    current_price: currentPrice ?? null,
    area: area ?? null,
    bedrooms: bedrooms ?? null,
    bathrooms: bathrooms ?? null,
    type,
    delivery_date: deliveryDate || null,
    images: normalizeImages(images),
    is_vis: Boolean(isVIS),
    status: "en-venta",
    ...(typeof leadId === "string" && leadId.trim().length > 0
      ? { lead_id: leadId }
      : {}),
  };

  const { data, error } = await supabase.from("properties").insert([payload]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    data?.[0] ? mapDbPropertyToProperty(data[0]) : null,
    { status: 201 },
  );
}
