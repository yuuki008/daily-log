"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageGridProps {
  images: string[];
  alt?: string;
}

const MAX_DISPLAY_IMAGES = 4;

export function ImageGrid({ images, alt = "Post image" }: ImageGridProps) {
  if (images.length === 0) return null;
  if (images.length === 1)
    return (
      <div className="flex items-center justify-center rounded overflow-hidden">
        <Image src={images[0]} alt={alt} width={1000} height={1000} />
      </div>
    );

  const displayImages = images.slice(0, MAX_DISPLAY_IMAGES);

  return (
    <div
      className={cn(
        "grid w-full gap-1 rounded overflow-hidden",
        images.length === 3 ? "grid-cols-3" : "grid-cols-2"
      )}
    >
      {displayImages.map((image, index) => {
        const isLastVisibleImageAndHasMore =
          index === displayImages.length - 1 &&
          images.length > MAX_DISPLAY_IMAGES;

        const remainingImages = images.length - MAX_DISPLAY_IMAGES;

        return (
          <div
            key={index}
            className="flex relative items-center justify-center aspect-square hover:bg-muted/50 transition"
            tabIndex={0}
            role="button"
            aria-label={`Enlarge image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
            />

            {isLastVisibleImageAndHasMore && (
              <div className="absolute z-10 w-full h-full bg-black/50 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  +{remainingImages}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
