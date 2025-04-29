import Image from "next/image";
import React from "react";
import { ImageInterface } from "@/app/Interfaces";


interface ImageCarouselProps {
    images: ImageInterface[];
    altText: string;
}
const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, altText }) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "ArrowRight") {
            handleNext();
        } else if (event.key === "ArrowLeft") {
            handlePrev();
        }
    };
    return (
        <div
            className="relative"
            onKeyDown={handleKeyDown}
            tabIndex={0} // Make the div focusable for keyboard navigation
        >
            <div
                className={`flex transition-transform duration-300`}
            >
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="h-full w-full flex-shrink-0"
                    >
                        <Image
                            width={0} // Set fixed width
                            height={0} // Set fixed height
                            sizes="100vw"
                            src={image.image_url}
                            alt={altText}
                            className="h-auto w-full"
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-800 p-2 text-white"
                aria-label="Previous image"
            >
                &#8249;
            </button>
            <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-800 p-2 text-white"
                aria-label="Next image"
            >
                &#8250;
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`h-2 w-2 rounded-full${
                            index === activeIndex ? "bg-white" : "bg-gray-500"
                        }`}
                        aria-label={`Go to image${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
