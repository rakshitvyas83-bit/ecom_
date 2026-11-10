import { NextResponse } from "next/server";
import { getAuthenticatedUser, getDatabases } from "@/lib/appwrite-server";
import { DATABASE_ID, ORDERS_ID } from "@/lib/constants";
import { isOrderStatus } from "@/lib/order-status";

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const authorization = req.headers.get("authorization");
  const jwt = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!jwt) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const user = await getAuthenticatedUser(jwt);
    if (!user.labels.includes("admin")) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
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
