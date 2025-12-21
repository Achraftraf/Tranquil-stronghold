"use client"

import { useState, useEffect } from "react";
import { Play, Award } from "lucide-react";
import { AnimatedWorkSection } from "@/components/animations/animated-work-section";
import { Project } from "@/types";
import { ProjectCard } from "@/components/project-card";
import { ProjectCardSkeleton } from "@/components/project-card-skeleton";
import { getProjects } from "@/lib/strapi";

const FeaturedProject = ({ project }: { project: Project }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <AnimatedWorkSection delay={0.2} classNames="w-full">
      <div className="relative bg-gradient-to-br from-blue-950 via-blue-800 to-blue-900 rounded-3xl overflow-hidden shadow-xl min-h-[500px] flex items-center">
        <div className="absolute inset-0 opacity-10">
          {/* <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-700 rounded-full -ml-24 -mb-24" /> */}
        </div>
        <div>

        lksdjfkldsajf
        </div>
        <div className="absolute inset-0 opacity-30">
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="relative z-10 p-6 md:p-10 lg:p-14 text-white max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Award className="w-4 h-4" />
            Featured Project
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {project.title}
          </h2>

          <p className="text-xl text-blue-50 mb-6 max-w-3xl leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            {Object.entries(project.stats).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-blue-100">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Now
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </AnimatedWorkSection>
  );
};

export default function Work() {
  const [projects, setProjects] = useState<Project[]>();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true); // Fixed typo: laoding -> loading

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await getProjects();
        console.log("Projects are : ", data);
        setProjects(data); 
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects()
  }, [])

  const categories = ["All", "Film", "Music", "Art"];
  const featuredProjects = projects?.filter(p => p.featured) || [];

  const filteredProjects = selectedCategory === "All"
    ? (projects || []).filter(p => !p.featured) // Exclude featured from main list
    : (projects || []).filter(p => p.category === selectedCategory && !p.featured);

  return (
    <section className="max-w-5xl mx-auto w-full min-h-screen text-black px-8">
      {/* Hero Section */}
      <div className="relative pt-10 px-6">
        <AnimatedWorkSection delay={0.1} classNames="max-w-7xl mx-auto text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Our Work
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-14">
            Creating safe spaces where Memphis youth share their stories through film, music, and art—amplifying voices that deserve to be heard.
          </p>
        </AnimatedWorkSection>
      </div>

      {/* Featured Projects Carousel */}
      {!loading && featuredProjects.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <FeaturedProject project={featuredProjects[0]} />
        </div>
      )}

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 pb-4">
        <AnimatedWorkSection delay={0.3}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold">All Projects</h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === cat
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedWorkSection>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        {loading ? (
          // Show skeletons while loading
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectCardSkeleton key={`skeleton-project-${index}`} index={index} />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          // Show actual projects when loaded
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={setSelectedProject}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No projects found in this category.
          </div>
        )}
      </div>

      {/* CTA Section */}
      <AnimatedWorkSection delay={0.2}>
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Want to Collaborate?</h2>
            <p className="text-xl mb-8 text-blue-50 max-w-2xl mx-auto">
              We're always looking for partners, mentors, and supporters who believe in
              empowering Memphis youth through creative expression.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg">
                Get Involved
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </AnimatedWorkSection>
    </section>
  );
}
