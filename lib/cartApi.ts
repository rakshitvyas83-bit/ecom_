import { AppwriteException } from "appwrite";
import { account, databases } from "@/lib/appwrite";
import { CARTS_ID, DATABASE_ID } from "@/lib/constants";
import type { CartItem } from "@/store/cart-store";

async function getAccountPrefs(userId: string) {
  const user = await account.get();
  if (user.$id !== userId) {
    throw new Error("The signed-in account changed while syncing the cart.");
  }
  return account.getPrefs<Record<string, unknown>>();
}

async function fetchLegacyCart(userId: string): Promise<CartItem[] | null> {
  try {
    const doc = await databases.getDocument(DATABASE_ID, CARTS_ID, userId);
    const items: unknown = JSON.parse(doc.items || "[]");
    if (!Array.isArray(items)) {
      throw new Error("The saved cart has an invalid format.");
    }
    return items as CartItem[];
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 404) return null;
    throw error;
  }
}

/** Returns null when the user has no saved cart yet. */
export async function fetchServerCart(userId: string): Promise<CartItem[] | null> {
  const prefs = await getAccountPrefs(userId);
  if (Array.isArray(prefs.cartItems)) {
    return prefs.cartItems as CartItem[];
  }

  const legacyItems = await fetchLegacyCart(userId);
  if (legacyItems) {
    await account.updatePrefs({ ...prefs, cartItems: legacyItems });
  }
  return legacyItems;
}

export async function saveServerCart(userId: string, items: CartItem[]) {
  const prefs = await getAccountPrefs(userId);
  await account.updatePrefs({ ...prefs, cartItems: items });
}
