import { Query } from "node-appwrite";
import { NextResponse } from "next/server";
import { getAuthenticatedUser, getDatabases } from "@/lib/appwrite-server";
import { DATABASE_ID, ORDERS_ID } from "@/lib/constants";
import { isOrderStatus } from "@/lib/order-status";

async function getAdmin(req: Request) {
  const authorization = req.headers.get("authorization");
  const jwt = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!jwt) return null;

  try {
    const user = await getAuthenticatedUser(jwt);
    return user.labels.includes("admin") ? user : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const admin = await getAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const params = new URL(req.url).searchParams;
  const requestedStatus = params.get("status");
  const offset = Number(params.get("offset") ?? 0);
  if (
    (requestedStatus && requestedStatus !== "all" && !isOrderStatus(requestedStatus)) ||
    !Number.isInteger(offset) ||
    offset < 0
  ) {
    return NextResponse.json({ error: "Invalid order filters." }, { status: 400 });
  }

  try {
    const queries = [
      ...(requestedStatus && requestedStatus !== "all"
        ? [Query.equal("status", requestedStatus)]
        : []),
      Query.orderDesc("$createdAt"),
      Query.limit(50),
      Query.offset(offset),
    ];
    const result = await getDatabases().listDocuments(DATABASE_ID, ORDERS_ID, queries);

    return NextResponse.json({
      orders: result.documents.map((order) => ({
        $id: order.$id,
        $createdAt: order.$createdAt,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        items: order.items,
        total: order.total,
        paymentStatus: order.paymentStatus,
        status: order.status || "placed",
        courierName: order.courierName,
        awbCode: order.awbCode,
      })),
      total: result.total,
      limit: 50,
      offset,
    });
  } catch (error) {
    console.error("Failed to load admin orders:", error);
    return NextResponse.json(
      { error: "Unable to load orders. Confirm the Orders table has a status column." },
      { status: 500 }
    );
  }
}
