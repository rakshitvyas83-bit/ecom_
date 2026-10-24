// /lib/upload.ts
import { storage } from "@/lib/appwrite";
import { BUCKET_ID } from "@/lib/constants";
import { ID } from "appwrite";

export const uploadImages = async (files: File[]) => {
  const uploads = await Promise.all(
    files.map(file =>
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