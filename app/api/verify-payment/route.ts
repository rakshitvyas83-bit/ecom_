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
      return NextResponse.json(
        {
          success: false,
          error: "We couldn't verify your account. If your payment went through, do not pay again; contact support.",
        },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      userId = await getAuthenticatedUserId(jwt);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Your session could not be verified. If your payment went through, do not pay again; contact support.",
        },
        { status: 401 }
      );
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

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification is not configured. Do not try another payment; contact support.",
        },
        { status: 503 }
      );
    }

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "The payment provider returned incomplete verification details." },
        { status: 400 }
      );
    }

    const bodyData = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(bodyData.toString())
      .digest("hex");

    const expectedSignatureBuffer = Buffer.from(expectedSignature);
    const receivedSignatureBuffer = Buffer.from(razorpay_signature);
    const isAuthentic =
      expectedSignatureBuffer.length === receivedSignatureBuffer.length &&
      crypto.timingSafeEqual(expectedSignatureBuffer, receivedSignatureBuffer);

    if (!isAuthentic) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment could not be verified. If your payment went through, do not pay again; contact support.",
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

    let order;
    try {
      order = await getDatabases().createDocument(
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

          courierName,
          awbCode,
        }
      );
    } catch (error) {
      console.error("Verified payment could not be saved as an order:", error);
      return NextResponse.json(
        {
          success: false,
          error: `Payment was received, but we couldn't save your order. Do not pay again. Contact support with payment reference ${razorpay_payment_id}.`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.$id,
    });
  } catch (error) {
    console.error("Payment verification request failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "We couldn't complete payment verification. If your payment went through, do not pay again; contact support.",
      },
      {
        status: 500,
      }
    );
  }
}