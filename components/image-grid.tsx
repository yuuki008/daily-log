"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface ImageGridProps {
  images: string[];
  alt?: string;
}

export function ImageGrid({ images, alt = "Post image" }: ImageGridProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  if (images.length === 0) return null;

  const isEven = images.length % 2 === 0;
  const multipleImageStyles = cn(
    "grid w-full gap-1 rounded overflow-hidden",
    isEven ? "grid-cols-2" : "grid-cols-3"
  );

  const handleClick = (idx: number) => {
    setCurrent(idx);
    setOpen(true);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // オーバーレイのクリックで閉じる
  const handleOverlayClick = () => {
    setOpen(false);
  };

  // プレビュー画像やボタンのクリックで閉じない
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className={cn(
          "w-full rounded overflow-hidden",
          images.length === 1
            ? "flex items-center justify-center"
            : multipleImageStyles
        )}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="flex items-center justify-center aspect-square cursor-pointer hover:bg-muted/50 transition"
            onClick={() => handleClick(index)}
            tabIndex={0}
            role="button"
            aria-label={`画像${index + 1}を拡大表示`}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/80"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={stopPropagation}
          >
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow"
                aria-label="前の画像"
              >
                &#8592;
              </button>
            )}
            <Image
              src={images[current]}
              alt={`${alt} ${current + 1}`}
              fill
              style={{ objectFit: "contain" }}
              className="w-full h-full max-w-full max-h-full select-none"
              priority
            />
            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow"
                aria-label="次の画像"
              >
                &#8594;
              </button>
            )}
            {/* 閉じるボタン */}
            <Button
              onClick={() => setOpen(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-20"
              aria-label="閉じる"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-2" onClick={stopPropagation}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "w-3 h-3 rounded-full",
                    idx === current ? "bg-white" : "bg-white/40"
                  )}
                  onClick={() => setCurrent(idx)}
                  aria-label={`画像${idx + 1}を表示`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
