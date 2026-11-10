import crypto from "crypto";

import { NextResponse } from "next/server";

import { ID } from "node-appwrite";

import { getAuthenticatedUserId, getDatabases } from "@/lib/appwrite-server";
import { generateMockShipment } from "@/lib/mockShipping";
import { DATABASE_ID, ORDERS_ID } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get("authorization");
    const jwt = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!jwt) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    let userId: string;
    try {
      userId = await getAuthenticatedUserId(jwt);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid or expired session." }, { status: 401 });
    }
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      customerName,
      customerEmail,
      customerPhone,

      city,
      address,
      stateName,
      pincode,

      items,
      total,
    } = body;

    const bodyData = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(bodyData.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const newOrderId = ID.unique();

    // Simulate creating a shipment + assigning a courier/AWB,
    // same shape as what Shiprocket's real API would return.
    const { courierName, awbCode } = generateMockShipment(newOrderId);

    const order = await getDatabases().createDocument(
      DATABASE_ID,
      ORDERS_ID,
      newOrderId,
      {
        userId,
        customerName,
        customerEmail,
        customerPhone,

        city,
        address,
        state: stateName,
        pincode,

        items: JSON.stringify(items),

        total,

        paymentId: razorpay_payment_id,

        razorpayOrderId: razorpay_order_id,

        paymentStatus: "paid",
        status: "placed",

        courierName,
        awbCode,
      }
    );

    return NextResponse.json({
      success: true,
      orderId: order.$id,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}