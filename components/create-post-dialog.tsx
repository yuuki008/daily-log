"use client";

import { useCallback, useState } from "react";
import { Plus, X } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import createClient from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface CreatePostDialogProps {
  onPostCreated?: () => void;
}

export function CreatePostDialog({ onPostCreated }: CreatePostDialogProps) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    setFiles((prev) => [...prev, ...imageFiles]);

    const newPreviewUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  }, []);

  const { getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    noClick: false,
  });

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0) return;

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      // ユーザー取得
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User is not authenticated");
      }
      // 投稿作成
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({ user_id: user.id, content })
        .select()
        .single();
      if (postError || !post) {
        throw new Error("Failed to create post");
      }
      // 画像アップロード
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
      if (onPostCreated) onPostCreated();
      setContent("");
      setFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowModal((prev) => !prev)}
        size="icon"
        className="cursor-pointer fixed left-1/2 -translate-x-1/2 bottom-4 h-10 w-10 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
      >
        <Plus
          className={cn(
            "h-8 w-8 transition-transform",
            showModal ? "rotate-45" : ""
          )}
        />
        <span className="sr-only">Create new post</span>
      </Button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed bottom-16 left-1/2 -translate-x-1/2 max-w-xl w-[95%] bg-background rounded-xl shadow-lg z-50 border border-muted-foreground/25 p-4"
            )}
          >
            <h2 className="text-lg font-bold mb-2">New Post</h2>
            <div>
              {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover w-20 h-20"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-[-10] cursor-pointer right-[-10] p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Textarea
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] resize-none text-base mb-2"
                disabled={isSubmitting}
              />

              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <label>
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="sr-only">Add image</span>
                      <input {...getInputProps()} style={{ display: "none" }} />
                    </label>
                  </Button>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={
                    (!content.trim() && files.length === 0) || isSubmitting
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
