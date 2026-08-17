"use client";

import { useRef, useState } from "react";
import { deleteCloudinaryImage } from "@/src/lib/actions/deleteCloudinaryImage";

export function useImagePicker(initialImageUrl?: string | null) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImageUrl ?? null,
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setImageError(null);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleRemoveImage() {
    const wasUploaded = previewUrl !== null && !previewUrl.startsWith("blob:");
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);

    setImageError(null);
    setImageFile(null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (wasUploaded && previewUrl) {
      try {
        await deleteCloudinaryImage(previewUrl);
      } catch {
        // Best-effort cleanup — an orphaned Cloudinary asset isn't worth
        // blocking the user's remove action over.
      }
    }
  }

  return {
    imageFile,
    previewUrl,
    imageError,
    setImageError,
    inputRef,
    handleImageChange,
    handleRemoveImage,
  };
}
