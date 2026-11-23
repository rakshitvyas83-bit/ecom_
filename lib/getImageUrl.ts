// /lib/getImageUrl.ts
import { storage } from "@/lib/appwrite";
import { BUCKET_ID } from "@/lib/constants";
import { ImageFormat, ImageGravity } from "appwrite";

export const getImageUrl = (fileId: string): string => {
  return storage
    .getFilePreview({
      bucketId: BUCKET_ID,
      fileId,
      width: 1200,
      quality: 78,
      gravity: ImageGravity.Center,
      output: ImageFormat.Webp,
    })
    .toString();
};