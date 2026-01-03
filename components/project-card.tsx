"use client";

import { useState } from "react";
import { AnimatedWorkSection } from "./animations/animated-work-section";
import { Film, Music, Palette, } from "lucide-react";
import { Project } from "@/types";


interface Props {
  project: Project
  index: number;
  onClick: (project: Project) => void;
}

export const ProjectCard: React.FC<Props> = ({ project, index, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const Icon = project.category === "Film" ? Film : project.category === "Music" ? Music : Palette;

  return (
    <AnimatedWorkSection delay={index * 0.1} classNames="group cursor-pointer" >
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-500 border border-gray-100 h-full flex flex-col" onClick={() => onClick(project)}>
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            onLoad={() => setImageLoaded(true)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>

          {project.featured && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}

        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              {project.category}
            </span>
          </div>

          <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>

          <p className="text-gray-600 mb-4 leading-relaxed flex-1">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            {Object.entries(project.stats).map(([key, value]) => (
              <div key={key}>
                <div className="text-sm text-gray-500 capitalize">{key}</div>
                <div className="font-semibold text-gray-900">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedWorkSection>
  );
};
