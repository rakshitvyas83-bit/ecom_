import { NextResponse } from "next/server";

interface IndiaPostOffice {
  District?: string;
  State?: string;
  Country?: string;
}

interface IndiaPostResponse {
  Status?: string;
  PostOffice?: IndiaPostOffice[] | null;
}

export async function GET(req: Request) {
  const pincode = new URL(req.url).searchParams.get("pincode") ?? "";
  if (!/^[1-9]\d{5}$/.test(pincode)) {
    return NextResponse.json(
      { error: "Enter a valid six-digit Indian PIN code." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      next: { revalidate: 86400 },
    });
    if (!response.ok) {
      throw new Error(`India Post lookup returned HTTP ${response.status}.`);
    }

    const result = (await response.json()) as IndiaPostResponse[];
    const postOffices = result[0]?.PostOffice;
    const office = postOffices?.find(
      (item) => item.Country === "India" && item.District && item.State
    );

    if (result[0]?.Status !== "Success" || !office) {
      return NextResponse.json(
        { error: "This PIN code was not found. Check the number and try again." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      city: office.District,
      state: office.State,
    });
  } catch (error) {
    console.error("Indian PIN code lookup failed:", error);
    return NextResponse.json(
      { error: "Could not verify this PIN code right now. Please try again." },
      { status: 502 }
    );
  }
}
