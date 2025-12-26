import React from 'react';
import { AnimatedWorkSection } from "./animations/animated-work-section";

interface ProjectCardSkeletonProps {
  index: number;
}

export const ProjectCardSkeleton: React.FC<ProjectCardSkeletonProps> = ({ index }) => {
  return (
    <AnimatedWorkSection delay={index * 0.1} classNames="group">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 h-full flex flex-col animate-pulse">
        {/* Image skeleton */}
        <div className="relative h-64 overflow-hidden bg-gray-300">
          {/* Icon skeleton */}
          <div className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full">
            <div className="w-5 h-5 bg-gray-300 rounded" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category skeleton */}
          <div className="mb-3">
            <div className="h-4 bg-gray-300 rounded w-16" />
          </div>

          {/* Title skeleton */}
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-3" />

          {/* Description skeleton */}
          <div className="space-y-2 mb-4 flex-1">
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
            <div className="h-4 bg-gray-300 rounded w-4/6" />
          </div>

          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-6 bg-gray-300 rounded-full w-16" />
            <div className="h-6 bg-gray-300 rounded-full w-20" />
            <div className="h-6 bg-gray-300 rounded-full w-14" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <div className="h-3 bg-gray-300 rounded w-12 mb-1" />
              <div className="h-5 bg-gray-300 rounded w-16" />
            </div>
            <div>
              <div className="h-3 bg-gray-300 rounded w-12 mb-1" />
              <div className="h-5 bg-gray-300 rounded w-16" />
            </div>
          </div>
        </div>
      </div>
    </AnimatedWorkSection>
  );
};





