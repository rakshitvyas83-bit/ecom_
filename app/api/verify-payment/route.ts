import crypto from "crypto";

import { NextResponse } from "next/server";

import { ID } from "node-appwrite";

import { getDatabases } from "@/lib/appwrite-server";
import { generateMockShipment } from "@/lib/mockShipping";

export async function POST(req: Request) {
  try {
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
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_ORDERS_COLLECTION_ID!,
      newOrderId,
      {
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