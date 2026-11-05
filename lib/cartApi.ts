import { AppwriteException, Permission, Role } from "appwrite";
import { databases } from "@/lib/appwrite";
import { CARTS_ID, DATABASE_ID } from "@/lib/constants";
import type { CartItem } from "@/store/cart-store";

const ownerOnly = (userId: string) => [
  Permission.read(Role.user(userId)),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId))
];

const isCode = (error: unknown, code: number) =>
  error instanceof AppwriteException && error.code === code;

/** Returns null when the user has no cart document yet. */
export async function fetchServerCart(userId: string): Promise<CartItem[] | null> {
  try {
    const doc = await databases.getDocument(DATABASE_ID, CARTS_ID, userId);
    const parsed = JSON.parse(doc.items || "[]");
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch (error) {
    if (isCode(error, 404)) return null;
    throw error;
  }
}

export async function saveServerCart(userId: string, items: CartItem[]) {
  const data = { items: JSON.stringify(items) };

  try {
    await databases.updateDocument(DATABASE_ID, CARTS_ID, userId, data);
  } catch (error) {
    if (!isCode(error, 404)) throw error;

    try {
      await databases.createDocument(DATABASE_ID, CARTS_ID, userId, data, ownerOnly(userId));
    } catch (createError) {
      // another tab created it first
      if (!isCode(createError, 409)) throw createError;
      await databases.updateDocument(DATABASE_ID, CARTS_ID, userId, data);
    }
  }
}