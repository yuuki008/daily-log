import Image from "next/image";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface ImagePreviewProps {
  images: string[];
  alt?: string;
  current: number;
  setCurrent: (idx: number) => void;
  onClose: () => void;
}

export function ImagePreview({
  images,
  alt = "Post image",
  current,
  setCurrent,
  onClose,
}: ImagePreviewProps) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragEndX, setDragEndX] = useState<number | null>(null);
  const swipeThreshold = 50;

  // 前の画像
  const handlePrev = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };
  // 次の画像
  const handleNext = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };
  // オーバーレイのクリックで閉じる
  const handleOverlayClick = () => {
    onClose();
  };
  // プレビュー画像やボタンのクリックで閉じない
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };
  // タッチイベント
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchStartX - touchEndX;
      if (diff > swipeThreshold) {
        handleNext();
      } else if (diff < -swipeThreshold) {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };
  // マウスドラッグイベント
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX !== null) {
      setDragEndX(e.clientX);
    }
  };
  const handleMouseUp = () => {
    if (dragStartX !== null && dragEndX !== null) {
      const diff = dragStartX - dragEndX;
      if (diff > swipeThreshold) {
        handleNext();
      } else if (diff < -swipeThreshold) {
        handlePrev();
      }
    }
    setDragStartX(null);
    setDragEndX(null);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/80"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={stopPropagation}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ touchAction: "pan-y" }}
      >
        {images.length > 1 && (
          <Button
            onClick={handlePrev}
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
            aria-label="前の画像"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
        <Image
          src={images[current]}
          alt={`${alt} ${current + 1}`}
          width={1000}
          height={1000}
          className="object-contain max-w-2xl mx-auto select-none"
          priority
        />
        {images.length > 1 && (
          <Button
            onClick={handleNext}
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
            aria-label="次の画像"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
        {/* 閉じるボタン */}
        <Button
          onClick={onClose}
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
          {images.map((_img, idx) => (
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
  );
}
