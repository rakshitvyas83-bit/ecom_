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

const saveQueues = new Map<string, Promise<void>>();

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
  const previous = saveQueues.get(userId) ?? Promise.resolve();
  const current = previous.catch(() => {}).then(async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const prefs = await getAccountPrefs(userId);
        const updated = await account.updatePrefs({ ...prefs, cartItems: items });
        if (!Array.isArray(updated.prefs.cartItems)) {
          throw new Error("Appwrite did not confirm the cart update.");
        }
        return;
      } catch (error) {
        lastError = error;
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
        }
      }
    }
    throw lastError;
  });
  saveQueues.set(userId, current);
  try {
    await current;
  } finally {
    if (saveQueues.get(userId) === current) saveQueues.delete(userId);
  }
}
