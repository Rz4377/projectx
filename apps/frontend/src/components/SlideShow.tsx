import { useState, useEffect } from 'react';
import { useDarkMode } from '../components/theme-provider'; // Import dark mode context

const images = [
  {
    light: '../../assets/image.png',
    dark: '../../assets/darkimage.png',
    caption: 'Chat with your friends in real time.',
  },
  {
    light: '../../assets/image2.png',
    dark: '../../assets/darkimage2.png',
    caption: 'Create post, with videos and images.',
  },
  {
    light: '../../assets/image3.png',
    dark: '../../assets/darkimage3.png',
    caption: 'Share your posts with the world.',
  },
  {
    light: '../../assets/image4.png',
    dark: '../../assets/darkimage4.png',
    caption: 'Search and add friends.',
  },
  {
    light: '../../assets/image5.png',
    dark: '../../assets/darkimage5.png',
    caption: 'Personalised profile space.',
  },
];

export default function SlideShow() {
  const { isDarkMode } = useDarkMode(); // Get dark mode state from context
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`slideshow-container relative flex-col items-center h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      } p-4 hidden md:flex`} // Hide on mobile with 'hidden md:flex'
    >
      {/* Image Container */}
      <div className="relative w-full max-w-xs h-[500px] mx-auto overflow-hidden">
        {images.map((image, index) => (
          <img
            key={index}
            src={isDarkMode ? image.dark : image.light} // Swap images based on dark mode
            alt={`Slide ${index}`}
            className={`absolute border-2 border-black dark:border-white dark:border-2 rounded-md inset-0 h-full object-contain transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Caption Container */}
      <div className="mt-4 h-12 text-center">
        {images.map((image, index) => (
          <div
            key={index}
            className={`text-2xl font-mono ${
              isDarkMode ? 'text-gray-400' : 'text-gray-800'
            } ${index === currentIndex ? 'block' : 'hidden'}`}
          >
            <span
              className="hidden sm:inline-block animate-typing text-lg text-gray-500 dark:border-white border-black pr-2"
              style={{
                animation: 'typing 3s steps(30, end), blink 0.7s step-end infinite',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              {image.caption}
            </span>

            {/* Fallback for Mobile View */}
            <span className="inline-block sm:hidden">{image.caption}</span>
          </div>
        ))}
      </div>
    </div>
  );
}