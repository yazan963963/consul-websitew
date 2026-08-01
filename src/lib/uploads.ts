import "server-only";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getSupabaseClient } from "./supabase/client";

type UploadKind = "cover" | "image" | "pdf";

const bucketByKind: Record<UploadKind, string> = {
  cover: "catalog-covers",
  image: "catalog-images",
  pdf: "catalog-pdfs",
};

function extensionFor(file: File) {
  const extension = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "");
  return extension || (file.type === "application/pdf" ? ".pdf" : ".jpg");
}

function validateFile(file: File, kind: UploadKind) {
  const isPdf = kind === "pdf";
  if (isPdf && file.type !== "application/pdf") throw new Error("INVALID_PDF");
  if (!isPdf && !file.type.startsWith("image/")) throw new Error("INVALID_IMAGE");
  const maxSize = isPdf ? 50 * 1024 * 1024 : 15 * 1024 * 1024;
  if (file.size > maxSize) throw new Error("FILE_TOO_LARGE");
}

export async function uploadFile(file: File, kind: UploadKind): Promise<string> {
  validateFile(file, kind);
  const filename = `${Date.now()}-${randomUUID()}${extensionFor(file)}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const supabase = getSupabaseClient();

  if (supabase) {
    const bucket = bucketByKind[kind];
    const { error } = await supabase.storage.from(bucket).upload(filename, bytes, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(filename).data.publicUrl;
  }

  const folder = path.join(process.cwd(), "public", "uploads", bucketByKind[kind]);
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, filename), bytes);
  return `/uploads/${bucketByKind[kind]}/${filename}`;
}

export function selectedFiles(formData: FormData, field: string): File[] {
  return formData.getAll(field).filter((value): value is File => value instanceof File && value.size > 0);
}
