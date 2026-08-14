export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message ?? "Image upload failed");
  }
  return data.secure_url;
}
