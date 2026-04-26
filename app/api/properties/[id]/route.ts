import { supabase } from "@/lib/supabase";
import { mapDbPropertyToProperty } from "@/lib/propertyMapper";
import { NextResponse, type NextRequest } from "next/server";

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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapDbPropertyToProperty(data), { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.projectName === "string")
    updates.project_name = body.projectName;
  if (typeof body.city === "string") updates.city = body.city;
  if (typeof body.neighborhood === "string")
    updates.neighborhood = body.neighborhood;
  if (typeof body.originalPrice === "number")
    updates.original_price = body.originalPrice;
  if (typeof body.currentPrice === "number")
    updates.current_price = body.currentPrice;
  if (typeof body.area === "number") updates.area = body.area;
  if (typeof body.bedrooms === "number") updates.bedrooms = body.bedrooms;
  if (typeof body.bathrooms === "number") updates.bathrooms = body.bathrooms;
  if (typeof body.type === "string") updates.type = body.type;
  if (typeof body.deliveryDate === "string" || body.deliveryDate === null) {
    updates.delivery_date = body.deliveryDate || null;
  }
  if (body.images !== undefined) updates.images = normalizeImages(body.images);
  if (typeof body.isVIS === "boolean") updates.is_vis = body.isVIS;
  if (typeof body.status === "string") updates.status = body.status;
  if (typeof body.leadId === "string" && body.leadId.trim().length > 0) {
    updates.lead_id = body.leadId;
  }

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

  return NextResponse.json(mapDbPropertyToProperty(data), { status: 200 });
}
