// pages/api/webhooks.js

import { createHmac } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const WEBHOOK_SECRET = process.env.TWAK_SECRET_KEY;

function verifySignature(body: string, signature: string): boolean {
  const digest = createHmac("sha1", WEBHOOK_SECRET as string)
    .update(body)
    .digest("hex");
  return signature === digest;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const body = req.body as string;
    const signature = req.headers["x-tawk-signature"] as string;

    if (!verifySignature(body, signature)) {
      return res
        .status(403)
        .json({ error: "Webhook signature verification failed" });
    }
    console.log("Received webhook event:", req.body);

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
