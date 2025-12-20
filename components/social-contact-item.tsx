import { Project } from '@/types';
import React, { useState } from 'react'
import { AnimatedWorkSection } from './animations/animated-work-section';
import { ExternalLink, Film, Music, Palette } from 'lucide-react';

export const portfolioData = [
  {
    id: 1,
    title: "Youth Voices Beyond Violence",
    category: "Film",
    description: "A powerful documentary series highlighting gifted Memphis youth who are creating change in their communities. Through intimate interviews and compelling storytelling, we showcase the dreams and drive of young people often overlooked by mainstream narratives.",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80",
    featured: true,
    stats: { views: "50K+", impact: "20+ Youth Featured" },
    tags: ["Documentary", "Community Impact", "Youth Stories"]
  },
  {
    id: 2,
    title: "Memphis Youth Art Exhibition 2024",
    category: "Art",
    description: "A curated collection of visual art created by Memphis youth exploring themes of identity, community, and hope. From paintings to mixed media installations, each piece tells a unique story of resilience and creativity.",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
    featured: true,
    stats: { artists: "35 Artists", visitors: "500+ Visitors" },
    tags: ["Visual Art", "Exhibition", "Youth Expression"]
  },
  {
    id: 3,
    title: "Beats & Stories: Music Production Workshop Series",
    category: "Music",
    description: "Youth-produced tracks and original compositions created during our music production workshops. From hip-hop to R&B, these tracks represent authentic voices and experiences of young Memphis creators.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    featured: false,
    stats: { tracks: "15 Tracks", participants: "25 Youth" },
    tags: ["Music Production", "Original Songs", "Hip-Hop"]
  },
  {
    id: 4,
    title: "Street Stories: A Visual Journey",
    category: "Film",
    description: "Short film series capturing the authentic experiences of Memphis youth navigating life, dreams, and challenges. Shot and edited by young filmmakers, these stories showcase raw talent and unique perspectives.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    featured: false,
    stats: { films: "8 Short Films", runtime: "45min Total" },
    tags: ["Short Films", "Youth Filmmakers", "Memphis Stories"]
  },
  {
    id: 5,
    title: "Community Mural Project",
    category: "Art",
    description: "Collaborative mural bringing together 30+ youth artists to transform a public space in Memphis. The mural celebrates community resilience, cultural heritage, and the power of collective creativity.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    featured: false,
    stats: { size: "40ft x 15ft", artists: "30+ Youth" },
    tags: ["Public Art", "Community", "Collaboration"]
  },
  {
    id: 6,
    title: "Rhythm & Poetry Showcase",
    category: "Music",
    description: "Live performances and recordings from our youth open mic nights. Featuring spoken word poetry, original songs, and freestyle performances that amplify young voices in the Memphis community.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    featured: false,
    stats: { performers: "40+ Youth", events: "12 Events" },
    tags: ["Live Performance", "Poetry", "Music"]
  },
  {
    id: 7,
    title: "Frames of Memphis: Youth Photography",
    category: "Art",
    description: "A photography exhibition capturing Memphis through the eyes of young artists. From street photography to portraits, these images reveal the beauty, struggle, and spirit of their communities.",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
    featured: true,
    stats: { photos: "100+ Images", photographers: "20 Youth" },
    tags: ["Photography", "Visual Storytelling", "Exhibition"]
  },
  {
    id: 8,
    title: "Future Forward: Youth Interviews",
    category: "Film",
    description: "Interview series featuring Memphis students, young artists, and changemakers discussing their aspirations, challenges, and visions for the future. Raw, honest conversations that deserve to be heard.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
    featured: false,
    stats: { interviews: "25+ Youth", episodes: "10 Episodes" },
    tags: ["Documentary", "Interviews", "Youth Leadership"]
  },
  {
    id: 9,
    title: "Creative Expressions: Multi-Media Showcase",
    category: "Art",
    description: "An immersive exhibition combining digital art, video installations, and interactive pieces created by youth exploring technology and traditional art forms in innovative ways.",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
    featured: false,
    stats: { pieces: "25 Works", mediums: "6 Different" },
    tags: ["Digital Art", "Installation", "Innovation"]
  }
];

interface Props {
  project: Project,
  index: number,
  onClick: (project: Project) => void
}


export const ProjectCard: React.FC<Props> = ({ project, index, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const Icon = project.category === "Film" ? Film : project.category === "Music" ? Music : Palette;

  return (
    <AnimatedWorkSection delay={index * 0.1} classNames="group cursor-pointer" onClick={() => onClick(project)}>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-500 border border-gray-100 h-full flex flex-col">
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
            <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
            <button className="w-full bg-white text-gray-900 py-2 rounded-full font-medium flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              View Project <ExternalLink className="w-4 h-4" />
            </button>
          </div>
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