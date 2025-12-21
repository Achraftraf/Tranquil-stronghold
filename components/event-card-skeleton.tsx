import React from 'react';
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { AnimatedSection } from "@/components/animations/animated-section";

interface EventCardSkeletonProps {
  index: number;
}

export const EventCardSkeleton: React.FC<EventCardSkeletonProps> = ({ index }) => {
  return (
    <AnimatedSection delay={index * 0.1} classNames="group">
      <div className="bg-gray-100 rounded-3xl overflow-hidden hover:shadow-md transition-all duration-500 border border-gray-200 animate-pulse">
        {/* Image skeleton */}
        <div className="relative h-64 overflow-hidden bg-gray-300">
          {/* Category badge skeleton */}
          <div className="absolute top-4 right-4 bg-gray-200 px-3 py-1 rounded-full">
            <div className="h-4 w-12 bg-gray-300 rounded" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="p-6">
          {/* Title skeleton */}
          <div className="h-7 bg-gray-300 rounded w-3/4 mb-3" />

          {/* Info items skeleton */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="h-4 bg-gray-300 rounded w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div className="h-4 bg-gray-300 rounded w-20" />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div className="h-4 bg-gray-300 rounded w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <div className="h-4 bg-gray-300 rounded w-16" />
            </div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
            <div className="h-4 bg-gray-300 rounded w-4/6" />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
