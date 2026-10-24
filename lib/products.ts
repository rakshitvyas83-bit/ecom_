import { ID, Query, type Models } from "appwrite";
import { databases } from "@/lib/appwrite";
import { DATABASE_ID, PRODUCTS_ID } from "@/lib/constants";
import { getImageUrl } from "@/lib/getImageUrl";
import type { Product, ProductCategory, ProductSize, SizeInventory } from "@/types/product";

type ProductDocument = Models.Document & {
  name?: string;
  description?: string;
  fabric?: string;
  price?: number;
  discountPrice?: number;
  discounted_price?: number;
  discountpercent?: number;
  discountPercent?: number;
  category?: ProductCategory;
  stock?: number;
  sizes?: string[] | string;
  sizeInventory?: SizeInventory[] | string;
  sizeinventory?: SizeInventory[] | string;
  images?: string[] | string;
  featured?: boolean;
  popular?: boolean;
  isfeatured?: boolean | string | number;
  isactive?: boolean | string | number;
  isshowcased?: boolean;
  createdAt?: string;
};

export interface ProductPayload {
  name: string;
  description: string;
  fabric: string;
  price: number;
  discountPrice?: number;
  discounted_price?: number;
  category: string;
  stock: number;
  sizes: string[];
  sizeInventory: SizeInventory[];
  images: string[];
  featured?: boolean;
  popular?: boolean;
  isactive?: boolean;
  isshowcased?: boolean;
}

const fallbackCategory: ProductCategory = "Daily Wear";

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(String).filter(Boolean);
      }
    } catch {
      return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }

  return [];
}

function toSizeInventory(value: unknown, sizes: string[], stock: number): SizeInventory[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => ({
        size: String(item?.size ?? "") as ProductSize,
        stock: Number(item?.stock ?? 0)
      }))
      .filter((item) => item.size);
  }

  if (typeof value === "string" && value.trim()) {
    try {
      return toSizeInventory(JSON.parse(value), sizes, stock);
    } catch {
      return [];
    }
  }

  return sizes.map((size) => ({ size: size as ProductSize, stock }));
}

function toImageUrl(image: string): string {
  if (image.startsWith("/") || image.startsWith("http")) {
    return image;
  }

  return String(getImageUrl(image));
}

function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "false" || normalized === "0" || normalized === "no") return false;
    if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
  }
  if (typeof value === "number") return value !== 0;

  return fallback;
}

export function normalizeProduct(document: ProductDocument): Product {
  const sizes = toStringArray(document.sizes) as ProductSize[];
  const stock = Number(document.stock ?? 0);
  const rawImages = toStringArray(document.images);
const images = rawImages.map(toImageUrl);
  const discountPrice =
    (document.discountPrice ?? document.discounted_price) === undefined ||
    (document.discountPrice ?? document.discounted_price) === null
      ? undefined
      : Number(document.discountPrice ?? document.discounted_price);
  const isactive = toBoolean(document.isactive, true);
  

  return {
    id: document.$id,
    name: document.name ?? "Untitled product",
    description: document.description ?? "",
    fabric: document.fabric ?? "Cotton",
    price: Number(document.price ?? 0),
    discountPrice,
    stock,
    sizes,
    sizeInventory: toSizeInventory(document.sizeInventory ?? document.sizeinventory, sizes, stock),
    category: document.category ?? fallbackCategory,
    images,
    imageIds: rawImages,
    featured: toBoolean(document.isfeatured ?? document.featured, false),
    popular: toBoolean(document.popular, false),
    isactive,
    isshowcased: toBoolean(document.isshowcased, false),
    createdAt: document.createdAt ?? document.$createdAt
  };
}

export async function listProducts(options: { includeInactive?: boolean } = {}): Promise<Product[]> {
  const response = await databases.listDocuments<ProductDocument>(
    DATABASE_ID,
    PRODUCTS_ID,
    [Query.orderDesc("$createdAt")]
  );

  return response.documents
    .filter((document) => options.includeInactive || toBoolean(document.isactive, true))
    .map(normalizeProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const document = await databases.getDocument<ProductDocument>(DATABASE_ID, PRODUCTS_ID, id);
    console.log("images raw:", document.images);
    return toBoolean(document.isactive, true) ? normalizeProduct(document) : null;
  } catch {
    return null;
  }
}

export async function createProduct(data: ProductPayload) {
  return createProductWithInventoryKey(data, "sizeInventory");
}

export async function updateProduct(id: string, data: ProductPayload) {
  return updateProductWithInventoryKey(id, data, "sizeInventory");
}

function productDocumentPayload(data: ProductPayload, inventoryKey: "sizeInventory" | "sizeinventory") {
  const payload: Record<string, unknown> = {
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    stock: data.stock,
    sizes: data.sizes,
    [inventoryKey]: JSON.stringify(data.sizeInventory),
    images: data.images,
    isactive: data.isactive ?? true,
    isfeatured: data.featured ?? false,
    isshowcased: data.isshowcased ?? false,
  };

  const discountPrice = data.discountPrice ?? data.discounted_price;

  if (discountPrice !== undefined) {
    payload.discounted_price = discountPrice;
  }

  return payload;
}

async function createProductWithInventoryKey(
  data: ProductPayload,
  inventoryKey: "sizeInventory" | "sizeinventory"
) {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      PRODUCTS_ID,
      ID.unique(),
      productDocumentPayload(data, inventoryKey)
    );
  } catch (error) {
    if (inventoryKey === "sizeInventory") {
      return createProductWithInventoryKey(data, "sizeinventory");
    }

    throw error;
  }
}

async function updateProductWithInventoryKey(
  id: string,
  data: ProductPayload,
  inventoryKey: "sizeInventory" | "sizeinventory"
) {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_ID,
      id,
      productDocumentPayload(data, inventoryKey)
    );
  } catch (error) {
    if (inventoryKey === "sizeInventory") {
      return updateProductWithInventoryKey(id, data, "sizeinventory");
    }

    throw error;
  }
}
export async function listShowcasedProducts(): Promise<Product[]> {
  const response = await databases.listDocuments<ProductDocument>(
    DATABASE_ID,
    PRODUCTS_ID,
    [Query.equal("isshowcased", true), Query.orderDesc("$createdAt")]
  );
  return response.documents.map(normalizeProduct);
}
