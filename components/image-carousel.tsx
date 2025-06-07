"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

export function ImageCarousel({
  images,
  alt = "Post image",
}: ImageCarouselProps) {
  if (images.length === 0) return null;

  const isEven = images.length % 2 === 0;
  const multipleImageStyles = cn(
    "grid w-full bg-muted gap-1 rounded overflow-hidden",
    isEven ? "grid-cols-2" : "grid-cols-3"
  );

  return (
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
          className="flex items-center justify-center aspect-square"
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
  );
}
