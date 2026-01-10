"use client"


import { AnimatedWorkSection } from "@/components/animations/animated-work-section";
import { Project } from "@/types";
import { ProjectCard } from "@/components/project-card";
import { ProjectCardSkeleton } from "@/components/project-card-skeleton";
import { getProjects } from "@/lib/strapi";
import Link from 'next/link'

import { useState, useEffect } from "react";
import { Play, Award, Instagram, ExternalLink, Sparkles, X, Filter } from "lucide-react";
import { AnimatedSection } from "@/components/animations/animated-section";
import { ParticleBackground } from "@/components/particle-background";

// Instagram post URLs from @thesfhaven
// To add more posts: Go to Instagram post → Click "..." → "Embed" → Copy the URL
const instagramPosts = [
  "https://www.instagram.com/p/DRkfATxETLx/",
  "https://www.instagram.com/p/DOeDUq2DogV/",
  "https://www.instagram.com/p/DNi059wRELg/",
  "https://www.instagram.com/p/DNQwFEtO03O/",
];

const InstagramEmbed = ({ url, index }: { url: string; index: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    
    const handleLoad = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
        setIsLoaded(true);
      }
    };

    script.addEventListener('load', handleLoad);
    
    if (!document.querySelector('script[src="//www.instagram.com/embed.js"]')) {
      document.body.appendChild(script);
    } else {
      handleLoad();
    }

    // Reprocess embeds after a delay to ensure they render
    const timer = setTimeout(() => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
        setIsLoaded(true);
      }
    }, 500 + index * 100);

    return () => {
      clearTimeout(timer);
      script.removeEventListener('load', handleLoad);
    };
  }, [url, index]);

  return (
    <div 
      className="instagram-post-wrapper group"
      style={{
        animation: 'fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${index * 0.08}s`,
        opacity: 0
      }}
    >
      <div className="relative overflow-hidden bg-white">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={`${url}?utm_source=ig_embed&utm_campaign=loading`}
          data-instgrm-version="14"
          style={{
            background: '#FFF',
            border: '0',
            borderRadius: '24px',
            boxShadow: 'none',
            margin: '0',
            padding: '0',
            width: '100%'
          }}
        >
          <div style={{ padding: '16px' }}>
            <a
              href={`${url}?utm_source=ig_embed&utm_campaign=loading`}
              style={{
                background: '#FFFFFF',
                lineHeight: '0',
                padding: '0',
                textAlign: 'center',
                textDecoration: 'none',
                width: '100%'
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#F4F4F4', borderRadius: '50%', flexGrow: 0, height: '40px', marginRight: '14px', width: '40px' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
                  <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: 0, height: '14px', marginBottom: '6px', width: '100px' }}></div>
                  <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: 0, height: '14px', width: '60px' }}></div>
                </div>
              </div>
              <div style={{ padding: '19% 0' }}></div>
              <div style={{ display: 'block', height: '50px', margin: '0 auto 12px', width: '50px' }}>
                <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                      <g>
                        <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            </a>
          </div>
        </blockquote>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0  transition-opacity duration-500 pointer-events-none rounded-3xl" />
      </div>
    </div>
  );
};

const InstagramFeed = () => {
  return (
    <div className="w-full bg-gradient-to-b from-white via-gray-50/30 to-white pt-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-center gap-4 pb-10">
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full ring-1 ring-purple-200">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-900">Latest Posts</span>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-full ring-1 ring-blue-200">
          <Award className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-900">Youth Stories</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mb-6">
        {instagramPosts.map((url, index) => (
          <InstagramEmbed key={url} url={url} index={index} />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Clean Instagram embed styling */
        .instagram-post-wrapper :global(.instagram-media) {
          margin: 0 !important;
          min-width: 100% !important;
          max-width: 100% !important;
          border: none !important;
          box-shadow: none !important;
        }

        .instagram-post-wrapper :global(.instagram-media-rendered) {
          border-radius: 24px !important;
        }

        /* Remove Instagram's default border */
        .instagram-post-wrapper :global(iframe) {
          border: none !important;
        }
      `}</style>
    </div>
  );
};

const FeaturedProject = ({ project }: { project: Project }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <AnimatedWorkSection delay={0.3} classNames="w-full">
      <div className="relative bg-gradient-to-br from-blue-900/70 via-teal-800 to-cyan-900 rounded-3xl overflow-hidden shadow-xl min-h-[400px] flex items-center">
        <div className="absolute inset-0 opacity-50">
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

          <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSc7sCv5f35LvLNNqXc_XzK2fNKGMniHx3hmFkwZHve0IOpAew/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
            className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 hover:text-teal-900 w-fit"
          >
            Register Now
          </a>
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
  const [showFilters, setShowFilters] = useState(false);

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
    <ParticleBackground/>
      <div className="relative py-10 px-6">
        <AnimatedSection delay={0.1} classNames="max-w-7xl mx-auto text-center flex flex-col items-center space-y-6">
          <span className="mb-4 inline-flex items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold tracking-wide text-blue-600 ring-1 ring-inset ring-blue-600/20 transition-all hover:bg-blue-100 hover:scale-105 cursor-default shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </span>
            Portfolio
          </span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent pb-1 pr-2">
            Our Work
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4 md:px-14 font-medium">
            Creating safe spaces where Memphis youth share their stories through film, music, and art—amplifying voices that deserve to be heard.
          </p>
        </AnimatedSection>
      </div>

      {/* Featured Projects Carousel */}
      {!loading && featuredProjects.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-8">
          <FeaturedProject project={featuredProjects[0]} />
        </div>
      )}

      {/* Category Filter */}
        <AnimatedSection delay={0.2} classNames="w-full px-2 md:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold">All Events</h2>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-300 hover:border-gray-400/70 hover:bg-gray-50 transition-all"
            >
              {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
              <span className="font-medium">Filter</span>
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === cat
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          </AnimatedSection>
          {/* <AnimatedWorkSection delay={0.3} classNames="text-center border mx-auto">
          <div className="flex justify-center flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-1 rounded-full font-medium transition-all ${selectedCategory === cat
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-teal-500/30 border border-blue-400"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedWorkSection>*/}
      <div className="max-w-5xl mx-auto px-6 pb-6">
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
          <div className="text-center py-12 text-gray-500  border border-dashed rounded-3xl">
            No projects found in this category.
          </div>
        )}
      </div>
      <InstagramFeed/>
      <AnimatedWorkSection delay={0.4}>
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="relative overflow-hidden rounded-[3rem] bg-white p-8 md:p-16 text-center ring-1 ring-blue-900/20 isolation-auto">

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
                  className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-teal-400 px-10 text-base font-bold text-white hover:border hover:border-blue-500"
                >
                  <span className="relative z-10">Get Involved</span>
                </a>

                <Link
                  href="/contact"
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-10 text-base font-bold text-gray-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 hover:scale-[1.02]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AnimatedWorkSection>
    </section>
  );
}
