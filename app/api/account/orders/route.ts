import { Query } from "node-appwrite";
import { NextResponse } from "next/server";
import { getAuthenticatedUserId, getDatabases } from "@/lib/appwrite-server";
import { DATABASE_ID, ORDERS_ID } from "@/lib/constants";

export async function GET(req: Request) {
  const authorization = req.headers.get("authorization");
  const jwt = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!jwt) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  let userId: string;
  try {
    userId = await getAuthenticatedUserId(jwt);
  } catch {
    return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
  }

  try {
    const orders = await getDatabases().listDocuments(
      DATABASE_ID,
      ORDERS_ID,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt"), Query.limit(100)]
    );

    return NextResponse.json({
      orders: orders.documents.map((order) => ({
        $id: order.$id,
        $createdAt: order.$createdAt,
        total: order.total,
        paymentStatus: order.paymentStatus,
        items: order.items,
      })),
    });
  } catch (error) {
    console.error("Failed to load account orders:", error);
    return NextResponse.json({ error: "Unable to load your orders." }, { status: 500 });
  }
}
