// lib/whatsapp.ts
export async function sendWhatsAppMessage(to: string, message: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    text: { body: message },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ Failed to send WhatsApp message:", err);
  } else {
    console.log("📤 WhatsApp message sent to:", to);
  }
}
