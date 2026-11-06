/**
 * Public image storage helpers for suite galleries.
 *
 * Uploads are written to the public `suite-images` Storage bucket and the
 * generated CDN URL is returned so it can be persisted on the suite record.
 */

import { createClient } from "@/lib/supabase/client";

export const SUITE_IMAGES_BUCKET = "suite-images";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;

function getFileExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  const fromType = file.type.split("/").pop()?.toLowerCase();
  return fromType === "jpeg" ? "jpg" : fromType || "jpg";
}

function createStoragePath(file: File): string {
  const extension = getFileExtension(file);
  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  return `suites/${uniqueId}.${extension}`;
}

/**
 * Upload a single image to the public `suite-images` bucket.
 *
 * @returns The public CDN HTTPS URL for the uploaded image.
 */
export async function uploadSuiteImage(file: File): Promise<string> {
  if (!file) {
    throw new Error("No file provided.");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new Error(
      "Unsupported file type. Please upload a JPG, PNG, WebP, AVIF, or GIF image."
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Image is too large. The maximum size is 10 MB.");
  }

  const path = createStoragePath(file);
  const supabase = createClient();

  const { error: uploadError } = await supabase.storage
    .from(SUITE_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from(SUITE_IMAGES_BUCKET)
    .getPublicUrl(path);

  if (!data.publicUrl) {
    throw new Error("Image uploaded but no public URL was returned.");
  }

  return data.publicUrl;
}

/**
 * Upload several images concurrently. Rejects if any upload fails.
 */
export async function uploadSuiteImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map((file) => uploadSuiteImage(file)));
}
