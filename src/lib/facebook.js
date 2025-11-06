import fetch from "node-fetch";

const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const DATASET_ID = process.env.FB_DATASET_ID;

export async function sendLeadEvent(name, phone) {
  const payload = {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    user_data: {
      fn: [name.toLowerCase()],
      ph: [phone.replace(/\D/g, "")],
    },
  };

  await fetch(`https://graph.facebook.com/v18.0/${DATASET_ID}/events?access_token=${ACCESS_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [payload] }),
  });
}
