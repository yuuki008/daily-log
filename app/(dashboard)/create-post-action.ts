"use server";

import { revalidatePath } from "next/cache";
import createClient from "@/lib/supabase/server";

export async function createPostAction(formData: FormData) {
  const supabase = await createClient();

  // Get user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User is not authenticated");
  }

  const content = formData.get("content") as string;
  // Create post
  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert({ user_id: user.id, content })
    .select()
    .single();
  if (postError || !post) {
    throw new Error("Failed to create post");
  }

  // Image upload
  const files: File[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("image-") && value instanceof File && value.size > 0) {
      files.push(value);
    }
  }
  if (files.length > 0) {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${post.id}/${index}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, file);
      if (uploadError) {
        console.error("Failed to upload image:", uploadError);
        return null;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(fileName);
      return {
        post_id: post.id,
        image_url: publicUrl,
        image_order: index,
      };
    });
    const imageRecords = await Promise.all(uploadPromises);
    const validImageRecords = imageRecords.filter((r) => r !== null);
    if (validImageRecords.length > 0) {
      const { error: imageError } = await supabase
        .from("post_images")
        .insert(validImageRecords);
      if (imageError) {
        console.error("Failed to create image record:", imageError);
      }
    }
  }

  revalidatePath("/");
  return post;
}
