"use client";

import { useCallback, useState } from "react";
import { Plus, X } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "lucide-react";
import { createPost } from "@/lib/api/posts-client";
import Image from "next/image";

export function CreatePostDialog() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createPost(content, files);
      setContent("");
      setFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setOpen(false);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 h-14 w-14 rounded-full shadow-lg z-50 hover:scale-110 transition-transform bg-primary hover:bg-primary/90"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">新しい投稿を作成</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新しい投稿</DialogTitle>
            <DialogDescription>テキストと画像を投稿できます</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="いまどうしてる？"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none text-base"
              disabled={isSubmitting}
            />

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={url}
                      alt={`プレビュー ${index + 1}`}
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

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} disabled={isSubmitting} />
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? "ここに画像をドロップ"
                  : "画像をドラッグ&ドロップまたはクリックして選択"}
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={
                  (!content.trim() && files.length === 0) || isSubmitting
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    投稿中...
                  </>
                ) : (
                  "投稿"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
