import { useEffect, useState, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; 

interface ImageData {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

function App() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastImageRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, isLoading]
  );

  useEffect(() => {
    async function fetchImages() {
      setIsLoading(true);
      const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=30`);
      const result = await response.json();
      if (result.length > 0) {
        setImages((prevImages) => [...prevImages, ...result]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    }
    fetchImages();
  }, [page]);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-8 text-center">ADME Assignment</h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap ml-2">
        {images.map((image, index) => {
          const isLastImage = index === images.length - 1;
          return (
            <div
              className="flex flex-col items-center p-4 bg-gray-100 rounded-md shadow-md"
              key={image.id}
              style={{ width: '100%', maxWidth: '300px' }}
              ref={isLastImage ? lastImageRef : null}
            >
              <img
                src={image.download_url}
                alt={`By ${image.author}`}
                className="w-full h-auto object-cover"
              />
              <p className="text-sm text-gray-600 mt-2">{image.author}</p>
            </div>
          );
        })}
      </div>
      {isLoading && (
        <div className="flex justify-center mt-8">
          <FontAwesomeIcon icon={faSpinner} spin className="text-gray-600 text-2xl" />
        </div>
      )}
    </div>
  );
}

export default App;
