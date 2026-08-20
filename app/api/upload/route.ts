import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getSessionAdminId } from "@/lib/auth";

export const runtime = "nodejs";

const BUCKET = "product-images";
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_FOLDERS = ["products", "banners"] as const;
type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

function isAllowedFolder(value: unknown): value is AllowedFolder {
  return (
    typeof value === "string" &&
    (ALLOWED_FOLDERS as readonly string[]).includes(value)
  );
}

function getExtension(filename: string): string {
  const match = /\.([a-zA-Z0-9]+)$/.exec(filename);
  if (!match) return "";
  const ext = match[1].toLowerCase();
  return ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"].includes(ext)
    ? `.${ext}`
    : "";
}

export async function POST(request: NextRequest) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder") ?? "products";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Image must be smaller than 8MB." },
      { status: 400 },
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are allowed." },
      { status: 400 },
    );
  }

  if (!isAllowedFolder(folder)) {
    return NextResponse.json(
      { error: "Invalid upload folder." },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseAdminClient();
    const fileName = `${Date.now()}-${randomUUID()}${getExtension(file.name)}`;
    const filePath = `${folder}/${fileName}`;

    console.log("[/api/upload] Uploading to Supabase:", {
      bucket: BUCKET,
      filePath,
      contentType: file.type,
      fileSize: file.size,
    });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, await file.arrayBuffer(), {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[/api/upload] Supabase upload error:", {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
      });
      return NextResponse.json(
        { error: "Image upload failed." },
        { status: 500 },
      );
    }

    console.log("[/api/upload] Upload succeeded:", {
      filePath,
      uploadData,
    });

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;
    console.log("[/api/upload] Public URL returned to client:", publicUrl);

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { error: "Image upload failed. Check Supabase Storage configuration." },
      { status: 500 },
    );
  }
}
