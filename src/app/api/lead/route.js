import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, phone } = await req.json();

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: "https://your-landing-page.com",
        user_data: {
          ph: [phone],
          fn: [name],
        },
      },
    ],
    access_token: process.env.FB_ACCESS_TOKEN,
  };

  await fetch(
    `https://graph.facebook.com/v18.0/${process.env.NEXT_PUBLIC_PIXEL_ID}/events`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  return NextResponse.json({ success: true });
}
