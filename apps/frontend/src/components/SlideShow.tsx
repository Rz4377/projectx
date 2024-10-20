
import { useState, useEffect } from 'react';

const images = [
  '../../assets/Image.webp',
  '../../assets/Image 2.webp',
  '../../assets/Image 3.webp',
  '../../assets/Image 4.webp',
  '../../assets/Image 5.webp',
  '../../assets/Image 6.webp'
];

export default function SlideShow() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        }, 3500); 

        return () => clearInterval(interval); 
    }, []);

    return (
        <div className="slideshow-container relative w-full h-64 overflow-hidden rounded-lg">
          {images.map((image, index) => (
            <img
                key={index}
                src={image}
                alt={`Slide ${index}`}
                className={`slide absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out 
                ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`
            }
        />
        ))}
    </div>
    );
}