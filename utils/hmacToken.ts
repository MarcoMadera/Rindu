export async function generateHMACSHA256Token(
  data: Record<string, string>
): Promise<string> {
  const secret = process.env.HMAC_SECRET;

  if (!secret) {
    throw new Error("env variable HMAC_SECRET is not set");
  }
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const dataToSign = encoder.encode(JSON.stringify(data));
  const signature = await crypto.subtle.sign("HMAC", key, dataToSign);
  return bufferToHex(signature);
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

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );

  const verifyToken = bufferToHex(
    await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(JSON.stringify(data))
    )
  );

  const isValidToken = token === verifyToken;

  return isValidToken;
}
