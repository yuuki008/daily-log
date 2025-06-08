import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function ImageCarousel({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  return (
    <Carousel className="relative w-full">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem className="w-full h-[512px]" key={image}>
            <Image
              className="w-full h-full object-contain"
              src={image}
              alt="Image"
              width={512}
              height={512}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 !bg-background/50 cursor-pointer" />
      <CarouselNext className="right-0 !bg-background/50 cursor-pointer" />
    </Carousel>
  );
}
