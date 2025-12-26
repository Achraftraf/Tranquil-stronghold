import React from 'react';

interface CardSkeletonProps {
  left: boolean;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ left }) => {
  return (
    <div className={`group relative w-full transition-all duration-500 rounded-2xl overflow-hidden bg-gray-100 flex flex-col pt-8 ${left ? "md:flex-row pl-8" : "md:flex-row-reverse pr-8"} items-stretch border border-gray-200 animate-pulse`}>
      {/* Image skeleton */}
      <div className="relative w-full md:w-1/2 min-h-[300px] overflow-hidden bg-gray-200 rounded-t-xl border-t border-l border-r border-gray-300">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" />
        
        {/* Icon skeleton */}
        <div className="absolute top-4 right-4 bg-gray-300 p-3 rounded-full border border-gray-400">
          <div className="w-6 h-6 bg-gray-400 rounded-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className={`relative w-full md:w-1/2 p-8 lg:p-10 flex flex-col justify-center ${left ? "text-left" : "text-right"}`}>
        {/* Title skeleton */}
        <div className={`h-10 bg-gray-300 rounded-lg mb-4 ${left ? "w-3/4" : "ml-auto w-3/4"}`} />
        
        {/* Description skeleton */}
        <div className={`space-y-3 mb-6 ${left ? "text-start" : "text-end"}`}>
          <div className={`h-4 bg-gray-300 rounded ${left ? "w-full" : "ml-auto w-full"}`} />
          <div className={`h-4 bg-gray-300 rounded ${left ? "w-5/6" : "ml-auto w-5/6"}`} />
          <div className={`h-4 bg-gray-300 rounded ${left ? "w-4/6" : "ml-auto w-4/6"}`} />
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;





