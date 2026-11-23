// /lib/upload.ts
import { storage } from "@/lib/appwrite";
import { BUCKET_ID } from "@/lib/constants";
import { ID } from "appwrite";

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return file;
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.82)
  );
  if (!blob) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp" });
}

export const uploadImages = async (files: File[]) => {
  const compressedFiles = await Promise.all(files.map(compressImage));
  const uploads = await Promise.all(
    compressedFiles.map(file =>
      storage.createFile(BUCKET_ID, ID.unique(), file)
    )
  );

  return uploads.map(f => f.$id);
};

export const deleteImages = async (ids: string[]) => {
  // only real Appwrite file IDs; skip static paths like "/pics/x.jpg" or full URLs
  const fileIds = ids.filter((id) => id && !id.startsWith("/") && !id.startsWith("http"));

  const results = await Promise.allSettled(
    fileIds.map((id) => storage.deleteFile(BUCKET_ID, id))
  );

  results.forEach((r, i) => {
    if (r.status === "rejected") console.error("Failed to delete file", fileIds[i], r.reason);
  });
};