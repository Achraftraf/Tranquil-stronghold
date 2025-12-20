import React from 'react'
import { AnimatedSection } from './animations/animated-section';

interface ImpactCardProps {
  icon: any;
  stat: string;
  label: string;
  index: number;
}

export const ImpactCard = ({ icon: Icon, stat, label, index }: ImpactCardProps) => (
  <div className="group bg-white rounded-3xl p-6 border border-gray-200 hover:shadow-sm transition-all duration-500">
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-[1.2] transition-transform duration-700">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div className="text-4xl font-bold text-blue-600 mb-1">{stat}</div>
      <div className="text-sm  text-gray-600">{label}</div>
    </div>
  </div>
);
