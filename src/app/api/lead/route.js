
import { NextResponse } from "next/server";
import crypto from "crypto";

// Helper: Normalize and hash value
function hash(value) {
  if (!value) return null;
  const normalized = value.toString().trim().toLowerCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

// Helper: Extract first name
function getFirstName(fullName) {
  if (!fullName) return null;
  return fullName.trim().split(" ")[0].toLowerCase();
}

export async function POST(req) {
  try {
    const { name, phone } = await req.json();

    // Normalize and hash PII
    const hashedPhone = hash(phone);
    const hashedFirstName = hash(getFirstName(name));

    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: "https://lead-landing-page.vercel.app/",
          user_data: {
            // Only send hashed values
            ph: hashedPhone ? [hashedPhone] : [],
            fn: hashedFirstName ? [hashedFirstName] : [],
            // Optional: client_ip and client_user_agent can be added from headers
          },
          // Recommended: include advanced matching if available
          // external_id, lead_id, etc. can also be added if needed
        },
      ],
      access_token: process.env.FB_ACCESS_TOKEN,
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.NEXT_PUBLIC_PIXEL_ID}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Facebook API Error:", result);
      return NextResponse.json(
        { success: false, error: result },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}