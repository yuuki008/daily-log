"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { ImagePreview } from "./image-preview";

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
        <ImagePreview
          images={images}
          alt={alt}
          current={current}
          setCurrent={setCurrent}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
