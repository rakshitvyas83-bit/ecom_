import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { getAuthenticatedUserId } from "@/lib/appwrite-server";

const checkoutEnvironmentVariables = [
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "NEXT_PUBLIC_APPWRITE_ENDPOINT",
  "NEXT_PUBLIC_APPWRITE_PROJECT_ID",
  "APPWRITE_API_KEY",
  "APPWRITE_DATABASE_ID",
  "APPWRITE_ORDERS_COLLECTION_ID",
];

function getRazorpayErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return {};
  }

  const errorRecord = error as Record<string, unknown>;
  const providerError =
    errorRecord.error && typeof errorRecord.error === "object"
      ? (errorRecord.error as Record<string, unknown>)
      : errorRecord;

  return {
    statusCode:
      typeof errorRecord.statusCode === "number" ? errorRecord.statusCode : undefined,
    code: typeof providerError.code === "string" ? providerError.code : undefined,
    description:
      typeof providerError.description === "string"
        ? providerError.description
        : undefined,
    reason: typeof providerError.reason === "string" ? providerError.reason : undefined,
  };
}

export async function POST(req: Request) {
  const authorization = req.headers.get("authorization");
  const jwt = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!jwt) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    await getAuthenticatedUserId(jwt);
  } catch {
    return NextResponse.json({ error: "Your session is invalid or expired. Please sign in again." }, { status: 401 });
  }

  let body: { amount?: unknown };
  try {
    body = await req.json();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const amount = body.amount;
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return NextResponse.json({ error: "A valid order amount is required." }, { status: 400 });
  }

  const amountInPaise = Math.round(amount * 100);
  if (!Number.isSafeInteger(amountInPaise) || amountInPaise < 100) {
    return NextResponse.json(
      { error: "The minimum payment amount is ₹1.00." },
      { status: 400 }
    );
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
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error) {
    const details = getRazorpayErrorDetails(error);
    console.error("Razorpay order creation failed:", details);

    return NextResponse.json(
      {
        error:
          details.description ||
          details.reason ||
          "Unable to create a payment order. Check the local server log for the Razorpay error code.",
        ...(details.code ? { code: details.code } : {}),
      },
      { status: 502 }
    );
  }
}