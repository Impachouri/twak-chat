// /api/webhooks

import { headers } from "next/headers";
import { createHmac } from "crypto";
import sendEmailNotification from "@/utils/emailService";

const WEBHOOK_SECRET = process.env.TWAK_SECRET_KEY;

async function verifySignature(
  body: string,
  signature: string | null
): Promise<boolean> {
  const digest = createHmac("sha1", WEBHOOK_SECRET as string)
    .update(body)
    .digest("hex");
  return signature === digest;
}

export async function POST(request: Request) {
  if (request.method === "POST") {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get("x-tawk-signature");

    if (!verifySignature(body, signature)) {
      return new Response("Webhook signature verification failed!", {
        status: 403,
      });
    }
    await sendEmailNotification(body);

    return new Response("Success!", {
      status: 200,
    });
  }

  return new Response(`Webhook error`, {
    status: 405,
  });
}
