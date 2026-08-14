"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/src/lib/prisma";
import { signInWithCredentials } from "../_lib/signInWithCredentials";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  imageUrl: z.string().url("Invalid image URL").nullish(),
});

type SignUpState = { error: string | null };

export async function signUp(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  // Validate the form data using the schema
  const result = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    imageUrl: formData.get("imageUrl"),
  });
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid form data" };
  }

  const { name, email, password, imageUrl } = result.data;

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return {
      error: "User already exists",
    };
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create the new user in the database
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      imageUrl,
    },
  });

  return signInWithCredentials(email, password, {
    invalidCredentials:
      "Account created, but sign-in failed. Please try logging in.",
    serverUnreachable:
      "Account created, but couldn't reach the server to sign you in. Please try logging in shortly.",
  });
}
