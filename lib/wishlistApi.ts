import { AppwriteException, Permission, Role } from "appwrite";
import { databases } from "@/lib/appwrite";
import { DATABASE_ID, WISHLISTS_ID } from "@/lib/constants";

const ownerOnly = (userId: string) => [
  Permission.read(Role.user(userId)),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId))
];

const isCode = (error: unknown, code: number) =>
  error instanceof AppwriteException && error.code === code;

/** Returns null when the user has no wishlist document yet. */
export async function fetchServerWishlist(userId: string): Promise<string[] | null> {
  try {
    const doc = await databases.getDocument(DATABASE_ID, WISHLISTS_ID, userId);
    return Array.isArray(doc.productIds) ? (doc.productIds as string[]) : [];
  } catch (error) {
    if (isCode(error, 404)) return null;
    throw error;
  }
}

export async function saveServerWishlist(userId: string, productIds: string[]) {
  const data = { productIds };

  try {
    await databases.updateDocument(DATABASE_ID, WISHLISTS_ID, userId, data);
  } catch (error) {
    if (!isCode(error, 404)) throw error;

    try {
      await databases.createDocument(DATABASE_ID, WISHLISTS_ID, userId, data, ownerOnly(userId));
    } catch (createError) {
      if (!isCode(createError, 409)) throw createError;
      await databases.updateDocument(DATABASE_ID, WISHLISTS_ID, userId, data);
    }
  }
}