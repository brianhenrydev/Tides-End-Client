import React from "react";
import { ImageInterface } from "@/app/Interfaces";

interface ImageCarouselProps {
  images: ImageInterface[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const nextSlide = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      {/* Carousel container */}
      <div 
        className="relative h-full w-full"
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute left-0 top-0 h-full w-full transition-opacity duration-500 ease-in-out${
              index === activeIndex ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
          >
            <img
              src={image.image_url}
              alt={`image${image.id}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-1 rounded-full transition-all${
              index === activeIndex ? "w-8 bg-white" : "w-4 bg-white/50"
            }`}
            aria-label={`Go to slide${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
