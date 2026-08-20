"use server";

import crypto from "node:crypto";

// Cloudinary URLs we generate look like:
// https://res.cloudinary.com/<cloud>/image/upload/v<version>/<public_id>.<ext>
function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return match ? match[1] : null;
}

// The actual Cloudinary API mechanics, kept separate from the "use server"
// boundary below. Deleting an asset requires a signed request (unlike the
// unsigned uploads in cloudinary.ts), since it needs to prove you actually
// own this Cloudinary account, not just know a preset name — this can only
// run server-side, where CLOUDINARY_API_SECRET is actually available.
async function deleteImageFromCloudinary(publicId: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
    .digest("hex");

  const body = new FormData();
  body.append("public_id", publicId);
  body.append("timestamp", String(timestamp));
  body.append("api_key", process.env.CLOUDINARY_API_KEY ?? "");
  body.append("signature", signature);

  await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
    { method: "POST", body },
  );
}

export async function deleteCloudinaryImage(url: string) {
  const publicId = extractPublicId(url);
  if (!publicId) return;

  await deleteImageFromCloudinary(publicId);
}
