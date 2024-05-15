// /api/webhooks

import { headers } from "next/headers";
import { createHmac } from "crypto";
import sendEmailNotification from "@/utils/emailService";

const WEBHOOK_SECRET = process.env.TWAK_SECRET_KEY;

if (!WEBHOOK_SECRET) {
  throw new Error(
    "Webhook secret is not defined in the environment variables."
  );
}

async function verifySignature(
  body: string,
  signature: string | null
): Promise<boolean> {
  if (!signature) return false;
  const digest = createHmac("sha1", WEBHOOK_SECRET as string)
    .update(body)
    .digest("hex");
  return signature === digest;
}

export async function POST(request: Request) {
  try {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get("x-tawk-signature");

    if (!(await verifySignature(body, signature))) {
      return new Response("Webhook signature verification failed!", {
        status: 403,
      });
    }

    await sendEmailNotification(body);

    return new Response("Success!", {
      status: 200,
    });
  } catch (error) {
    console.error("Error handling webhook request:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
