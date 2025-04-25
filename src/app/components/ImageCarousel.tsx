import React from "react";

const ImageCarousel = ({ images, altText }) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="relative h-48 w-full overflow-hidden">
            <div
                className="flex transition-transform duration-300"
                style={{
                    transform: `translateX(-${activeIndex * 100}%)`,
                }}
            >
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="h-full w-full flex-shrink-0"
                    >
                        <img
                            src={image.image_url}
                            alt={altText}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-800 p-2 text-white"
            >
                &#8249;
            </button>
            <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-800 p-2 text-white"
            >
                &#8250;
            </button>
        </div>
    );
}

export default ImageCarousel;
