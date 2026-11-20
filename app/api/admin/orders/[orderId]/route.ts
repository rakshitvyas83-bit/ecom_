import { Query } from "node-appwrite";
import { NextResponse } from "next/server";
import { getAuthenticatedUser, getDatabases } from "@/lib/appwrite-server";
import { DATABASE_ID, ORDERS_ID, PRODUCTS_ID } from "@/lib/constants";
import { getImageUrl } from "@/lib/getImageUrl";
import { isOrderStatus } from "@/lib/order-status";
import { hasAdminLabel } from "@/lib/admin-auth";

interface OrderItemSnapshot {
  productId: string;
  image?: string;
  [key: string]: unknown;
}

function firstImageUrl(value: unknown): string | undefined {
  let image: unknown;

  if (Array.isArray(value)) {
    image = value[0];
  } else if (typeof value === "string" && value.trim()) {
    try {
      const parsed: unknown = JSON.parse(value);
      image = Array.isArray(parsed) ? parsed[0] : value;
    } catch {
      image = value.split(",")[0].trim();
    }
  }

  if (typeof image !== "string" || !image.trim()) return undefined;
  return image.startsWith("/") || image.startsWith("http")
    ? image
    : getImageUrl(image);
}

async function getAdmin(req: Request) {
  const authorization = req.headers.get("authorization");
  const jwt = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!jwt) return null;

  try {
    const user = await getAuthenticatedUser(jwt);
    return hasAdminLabel(user.labels) ? user : null;
  } catch {
    return null;
  }
}

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const admin = await getAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const order = await getDatabases().getDocument(
      DATABASE_ID,
      ORDERS_ID,
      params.orderId
    );
    const items = JSON.parse(order.items) as OrderItemSnapshot[];
    const productIds = Array.from(
      new Set(items.filter((item) => !item.image).map((item) => item.productId))
    );
    const productImages = new Map<string, string>();

    if (productIds.length > 0) {
      const products = await getDatabases().listDocuments(
        DATABASE_ID,
        PRODUCTS_ID,
        [Query.equal("$id", productIds), Query.limit(productIds.length)]
      );
      for (const product of products.documents) {
        const image = firstImageUrl(product.images);
        if (image) productImages.set(product.$id, image);
      }
    }

    const itemsWithImages = items.map((item) => ({
      ...item,
      image: item.image || productImages.get(item.productId),
    }));

    return NextResponse.json({
      order: {
        $id: order.$id,
        $createdAt: order.$createdAt,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        items: JSON.stringify(itemsWithImages),
        total: order.total,
        paymentStatus: order.paymentStatus,
        status: order.status || "placed",
        courierName: order.courierName,
        awbCode: order.awbCode,
      },
    });
  } catch (error) {
    console.error("Failed to load admin order summary:", error);
    return NextResponse.json(
      { error: "Unable to load this order summary." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const authorization = req.headers.get("authorization");
  const jwt = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!jwt) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  let user: Awaited<ReturnType<typeof getAuthenticatedUser>>;
  try {
    user = await getAuthenticatedUser(jwt);
  } catch {
    return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
  }
  if (!hasAdminLabel(user.labels)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  let status: unknown;
  try {
    ({ status } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isOrderStatus(status)) {
    return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
  }

  try {
    const order = await getDatabases().updateDocument(
      DATABASE_ID,
      ORDERS_ID,
      params.orderId,
      { status }
    );
    return NextResponse.json({ orderId: order.$id, status: order.status });
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { error: "Unable to update order status. Confirm the Orders table has a status column." },
      { status: 500 }
    );
  }
}
