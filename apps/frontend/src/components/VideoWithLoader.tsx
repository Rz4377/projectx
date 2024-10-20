import { useState } from 'react';

interface VideoWithLoaderProps {
  src: string;
  poster?: string;
}

export default function VideoWithLoader({ src, poster }: VideoWithLoaderProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <div className="loader animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      )}
      <video
        src={src}
        poster={poster}
        preload="metadata"
        onLoadedData={() => setLoading(false)}
        onError={() => setLoading(false)}
        controls
        className={`w-full rounded-md transition-opacity duration-500 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}