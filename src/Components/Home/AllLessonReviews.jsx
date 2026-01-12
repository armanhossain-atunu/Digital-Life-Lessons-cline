import { useState, useEffect } from 'react';

const AllLessonReviews = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 768) {
        setSlidesPerView(2);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(3);
      } else {
        setSlidesPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/lessons/reviews/all`);
        const result = await res.json();
        setData(result);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  const maxSlide = Math.max(0, data.length - slidesPerView);

  useEffect(() => {
    if (data.length === 0 || maxSlide === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(timer);
  }, [data.length, maxSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(Math.min(index, maxSlide));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">Failed to load reviews.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-base-800">All Lesson Reviews</h1>
      
      <div className="relative">
        {/* Slider Container */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{ 
              transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
            }}
          >
            {data.map((review, index) => (
              <div 
                key={index} 
                className="flex-shrink-0"
                style={{ width: `calc(${100 / slidesPerView}% - ${(slidesPerView - 1) * 24 / slidesPerView}px)` }}
              >
                <div className="border rounded-lg shadow-lg bg-base-200 h-full p-5 hover:shadow-xl transition-shadow">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-base-800 line-clamp-2 mb-2">
                      {review.lessonTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={review.reviewerPhoto}
                      alt={review.reviewerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-base-800">
                        {review.reviewerName}
                      </h4>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-lg">⭐</span>
                        <span className="font-semibold text-base-700">{review.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-base-700 text-sm leading-relaxed mb-4">
                    {review.comment}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {data.length > slidesPerView && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-base-200/90 hover:bg-base-200 p-3 rounded-full shadow-lg transition-all z-10"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6 text-base-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-base-200/90 hover:bg-base-200 p-3 rounded-full shadow-lg transition-all z-10"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6 text-base-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {data.length > slidesPerView && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxSlide + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-base-300 hover:bg-gray-400 w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllLessonReviews;