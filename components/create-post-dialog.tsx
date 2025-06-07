"use client";

import { useCallback, useState } from "react";
import { Plus, X } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "lucide-react";
import { createPostAction } from "@/app/(dashboard)/create-post-action";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function CreatePostDialog() {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
      const formData = new FormData();
      formData.append("content", content);
      files.forEach((file, i) => {
        formData.append(`image-${i}`, file);
      });
      await createPostAction(formData);
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
        onClick={() => setShowModal(true)}
        size="icon"
        className="cursor-pointer fixed bottom-6 right-6 md:bottom-8 md:right-8 h-14 w-14 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
      >
        <Plus className="h-8 w-8" />
        <span className="sr-only">Create new post</span>
      </Button>

      {showModal && (
        <div
          className={cn(
            "fixed bottom-6 right-6 md:bottom-8 md:right-8 max-w-2xl w-full bg-background rounded-xl shadow-lg z-50 border border-muted-foreground/25 p-6",
            showModal ? "scale-100 opacity-100" : "scale-90 opacity-0",
            "animate-modal"
          )}
        >
          <div className="flex justify-between mb-2">
            <h2 className="text-lg font-bold">New Post</h2>
            <Button
              variant="ghost"
              onClick={() => setShowModal(false)}
              size="icon"
              className="rounded-full"
              disabled={isSubmitting}
            >
              <X />
            </Button>
          </div>
          <div>
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none text-base mb-2"
              disabled={isSubmitting}
            />

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover w-full h-32"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="sr-only">Add image</span>
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
        </div>
      )}
    </>
  );
}
