import { createHmac } from "crypto";

export function generateHMACSHA256Token(data: Record<string, string>): string {
  const secret = process.env.HMAC_SECRET;

  if (!secret) {
    throw new Error("env variable HMAC_SECRET is not set");
  }

  const hmac = createHmac("sha256", secret);
  hmac.update(JSON.stringify(data));
  return hmac.digest("hex");
}

function bufferToHex(arrayBuffer: ArrayBuffer): string {
  return Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (n: number) =>
      n.toString(16).padStart(2, "0")
    )
    .join("");
}

export async function verifyHMACSHA256Token(
  token: string,
  data: Record<string, string>
): Promise<boolean> {
  const secret = process.env.HMAC_SECRET;

  if (!token || !data) {
    throw new Error("token or id is missing");
  }

  if (!secret) {
    throw new Error("env variable HMAC_SECRET is not set");
  }

  const key = crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );

  const verifyToken = bufferToHex(
    await crypto.subtle.sign(
      "HMAC",
      await key,
      new TextEncoder().encode(JSON.stringify(data))
    )
  );

  const isValidToken = token === verifyToken;

  return isValidToken;
}
