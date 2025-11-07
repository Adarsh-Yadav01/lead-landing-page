// pages/api/lead.js
import { NextResponse } from "next/server";
import crypto from "crypto";

const hash = (value) => {
  if (!value) return null;
  const normalized = String(value).trim().toLowerCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
};

const getFirstName = (fullName) => {
  if (!fullName) return null;
  return fullName.trim().split(" ").shift(); // First word only
};

export async function POST(req) {
  try {
    const { name, phone } = await req.json();

    // Extract client info
    const ip = req.headers.get("x-forwarded-for")?.split(",").shift().trim() || "";
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "https://lead-landing-page.vercel.app/";

    // Hash PII
    const hashedPhone = phone ? hash(phone.replace(/[^0-9]/g, "")) : null;
    const hashedFirstName = name ? hash(getFirstName(name)) : null;

    if (!hashedPhone && !hashedFirstName) {
      return NextResponse.json(
        { success: false, error: "Missing identifiable user data" },
        { status: 400 }
      );
    }

    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: referer,
          event_id: crypto.randomUUID(),
          user_data: {
            ph: hashedPhone ? [hashedPhone] : [],
            fn: hashedFirstName ? [hashedFirstName] : [],
            client_ip_address: ip,
            client_user_agent: userAgent,
          },
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.NEXT_PUBLIC_PIXEL_ID}/events?access_token=${process.env.FB_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      console.error("CAPI Error:", result);
      return NextResponse.json({ success: false, error: result }, { status: 500 });
    }

    return NextResponse.json({ success: true, response: result });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
