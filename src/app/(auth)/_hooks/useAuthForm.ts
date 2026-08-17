"use client";

import { startTransition, useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { uploadImage } from "@/src/app/services/cloudinary";

type AuthFormState = { error: string | null };
type AuthFormAction = (
  prevState: AuthFormState,
  formData: FormData,
) => Promise<AuthFormState>;

export function useAuthForm(action: AuthFormAction) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const [state, setState] = useState<AuthFormState>({ error: null });
  const [isPending, setIsPending] = useState(false);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageError(null);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageError(null);
    setImageFile(null);
    setPreviewUrl(null);
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (imageFile) {
      setIsUploading(true);
      try {
        formData.set("imageUrl", await uploadImage(imageFile));
      } catch {
        setImageError(
          "Couldn't upload image. Try again, or sign up without one.",
        );
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setImageFile(null);
        setPreviewUrl(null);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    setState({ error: null });
    startTransition(async () => {
      setIsPending(true);
      try {
        setState(await action({ error: null }, formData));
      } catch (error) {
        // redirect() throws a control-flow error on success — let Next.js
        // handle that navigation instead of treating it as a failure.
        unstable_rethrow(error);
        setState({
          error:
            "Couldn't reach the server. Check your connection and try again.",
        });
      } finally {
        setIsPending(false);
      }
    });
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    previewUrl,
    isUploading,
    imageError,
    state,
    isPending,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
  };
}
