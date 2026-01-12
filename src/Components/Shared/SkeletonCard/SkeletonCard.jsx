const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-base-300 rounded-xl p-4 shadow">
      <div className="h-48 bg-gray-300 rounded"></div>

      <div className="mt-4 h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>

      <div className="mt-4 h-10 bg-gray-300 rounded"></div>
    </div>
  );
};

export default SkeletonCard;
