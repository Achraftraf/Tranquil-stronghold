import React from 'react';

const MemberSkeleton: React.FC = () => {
  return (
    <div className="group flex flex-col h-full rounded-3xl bg-zinc-100 transition-all duration-500 ease-out border-[1px] border-zinc-300 animate-pulse">
      {/* Image skeleton */}
      <div className="relative rounded-t-3xl overflow-hidden w-full h-[230px] sm:h-[250px] bg-gray-300">
        <div className="absolute top-[80%] h-1/4 inset-0 bg-gradient-to-b from-transparent via-zinc-100/50 to-zinc-100/95 border-none" />
      </div>

      {/* Content skeleton */}
      <div className="p-3 md:p-4 flex-1 flex flex-col">
        {/* Role skeleton */}
        <div className="mb-1.5 h-7 bg-gray-300 rounded w-3/4" />
        
        {/* Name and Instagram skeleton */}
        <div className="mb-3 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-300 rounded w-1/3" />
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-5/6" />
          <div className="h-3 bg-gray-300 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
};

export default MemberSkeleton;







