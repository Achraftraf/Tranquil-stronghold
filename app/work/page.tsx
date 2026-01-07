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
      <div className="relative bg-gradient-to-br from-blue-900 via-teal-800 to-cyan-900 rounded-3xl overflow-hidden shadow-xl min-h-[500px] flex items-center">
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
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-white/10 shadow-lg">
            <Award className="w-4 h-4 text-teal-300" />
            <span className="text-teal-50">Featured Project</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-teal-100 bg-clip-text text-transparent">
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
            <button className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 hover:text-teal-900">
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
        <AnimatedWorkSection delay={0.1} classNames="max-w-7xl mx-auto text-center flex flex-col items-center space-y-6">
          <span className="mb-2 inline-flex items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold tracking-wide text-blue-600 ring-1 ring-inset ring-blue-600/20 transition-all hover:bg-blue-100 hover:scale-105 cursor-default shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </span>
            Portfolio
          </span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent pb-1 pr-2">
            Our Work
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4 md:px-14 font-medium">
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
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30"
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
          <div className="relative overflow-hidden rounded-[3rem] bg-white p-8 md:p-16 text-center shadow-[0_30px_100px_-20px_rgba(59,130,246,0.15),0_10px_40px_-10px_rgba(0,0,0,0.05)] ring-1 ring-blue-900/5 isolation-auto">

            {/* Dynamic brand background effects */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-100/50 via-teal-100/40 to-cyan-100/30 rounded-full blur-3xl opacity-70 animate-pulse-slow mix-blend-multiply"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[35rem] h-[35rem] bg-gradient-to-tr from-cyan-100/50 via-blue-100/40 to-teal-100/30 rounded-full blur-3xl opacity-70 animate-pulse-slow [animation-delay:2s] mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-plus-darker pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-gray-900">
                Want to <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent decoration-clone pr-2 pb-1">Collaborate?</span>
              </h2>

              <p className="text-xl mb-10 text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
                We're always looking for partners, mentors, and supporters who believe in
                empowering Memphis youth through creative expression.
              </p>

              <div className="flex flex-wrap gap-5 justify-center">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSc7sCv5f35LvLNNqXc_XzK2fNKGMniHx3hmFkwZHve0IOpAew/viewform?usp=dialog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-teal-400 px-10 text-base font-bold text-white shadow-[0_10px_30px_-5px_rgba(37,99,235,0.4)] transition-all hover:shadow-[0_20px_40px_-5px_rgba(37,99,235,0.5)] hover:scale-[1.02]"
                >
                  <span className="relative z-10">Get Involved</span>
                </a>

                <a
                  href="mailto:admin@steadfasthaven.org"
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-10 text-base font-bold text-gray-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 hover:scale-[1.02]"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </AnimatedWorkSection>
    </section>
  );
}
