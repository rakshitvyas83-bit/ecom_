import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";

const checkoutEnvironmentVariables = [
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "NEXT_PUBLIC_APPWRITE_ENDPOINT",
  "NEXT_PUBLIC_APPWRITE_PROJECT_ID",
  "APPWRITE_API_KEY",
  "APPWRITE_DATABASE_ID",
  "APPWRITE_ORDERS_COLLECTION_ID",
];

export async function POST(req: Request) {
  let body: { amount?: unknown };
  try {
    body = await req.json();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const amount = body.amount;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "A valid order amount is required" }, { status: 400 });
  }

  const missingVariables = checkoutEnvironmentVariables.filter((name) => !process.env[name]);
  if (missingVariables.length > 0) {
    return NextResponse.json(
      { error: `Checkout is not configured. Missing environment variables: ${missingVariables.join(", ")}` },
      { status: 503 }
    );
  }

  try {
    const order = await getRazorpay().orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);

    return NextResponse.json(
      { error: "Unable to create a payment order. Please try again." },
      { status: 502 }
    );
  }
}