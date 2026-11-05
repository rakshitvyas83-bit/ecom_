import { account } from "@/lib/appwrite";
import type { CartItem } from "@/store/cart-store";

async function getAccountPrefs(userId: string) {
  const user = await account.get();
  if (user.$id !== userId) {
    throw new Error("The signed-in account changed while syncing the cart.");
  }
  return account.getPrefs<Record<string, unknown>>();
}

const saveQueues = new Map<string, Promise<void>>();

/** Returns null when the user has no saved cart yet. */
export async function fetchServerCart(userId: string): Promise<CartItem[] | null> {
  const prefs = await getAccountPrefs(userId);
  const savedItems = prefs.cartItems;
  if (savedItems === undefined) {
    return null;
  }
  if (!Array.isArray(savedItems)) {
    throw new Error("The saved cart has an invalid format.");
  }
  return savedItems as CartItem[];
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
