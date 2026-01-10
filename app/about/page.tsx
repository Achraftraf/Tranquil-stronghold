"use client";

import {
  AnimatedSection,
} from "@/components/animations/animated-section";
import Member from "@/components/memeber";
import MemberSkeleton from "@/components/member-skeleton";
import { Heart, Film, Users, Mail, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { getTeamMembers } from "@/lib/strapi";
import { TeamMember } from "@/types";
import { ImpactCard } from "@/components/impact-card";
import { ParticleBackground } from "@/components/particle-background";
import Link from "next/link"

export default function About() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await getTeamMembers();

        console.log("Fetched team data:", data);
        setTeam(data);
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, []);

  return (
    <section className="w-full min-h-screen bg-white text-black max-w-5xl mx-auto p-10 space-y-8 md:space-y-10  lg:space-y-12">
      <ParticleBackground/>
      <AnimatedSection delay={0.1} classNames="text-center">
        <span className="mb-4 inline-flex items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold tracking-wide text-blue-600 ring-1 ring-inset ring-blue-600/20 transition-all hover:bg-blue-100 hover:scale-105 cursor-default shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
          </span>
          Who we are
        </span>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter max-w-4xl mb-2 text-gray-900 leading-tight">
         <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent drop-shadow-sm pr-2 pb-1"> Steadfast Haven</span>
        </h2>
        <p className="max-w-1.5xl text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Empowering Memphis youth to tell their<br/> stories and build their futures
          through creative expression.
        </p>
      </AnimatedSection>


      <AnimatedSection delay={0.2} classNames="">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
          <img
            src="https://plus.unsplash.com/premium_photo-1712000450933-b06ab8312e78?q=80&w=3089&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Young people collaborating creatively"
            className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/30" />
          <div className="relative z-10 p-6 md:p-14 text-white max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-blue-500/90 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              Our Mission
            </span>

            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Empowering Youth Through
              <span className="block text-cyan-400">Creative Expression</span>
            </h2>

            <p className="text-lg  text-gray-200 leading-relaxed mb-8">
              Steadfast Haven is a Memphis-based nonprofit that provides safe,
              creative spaces where underserved youth develop real-world skills
              through art, film, and music — building confidence, purpose, and
              community impact.
            </p>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="text-gray-400">Programs</div>
                <div className="font-semibold">Art • Film • Music</div>
              </div>
              <div>
                <div className="text-gray-400">Location</div>
                <div className="font-semibold">Memphis, TN</div>
              </div>
            </div>
          </div>

        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.6} classNames="text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-3 text-gray-900">Meet 
        {" "}<span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent drop-shadow-sm pr-2 pb-1">Our Team</span>
        </h2>
        <p className="text-lg lg:text-xl text-gray-600 max-w-2.2xl mx-auto">
          Steadfast Haven is led by a passionate and mission-driven team
          committed to creating<br/> lasting impact through strategic leadership,
          clear communication, and strong<br/> community connections.
        </p>
      </AnimatedSection>

      <AnimatedSection
        delay={0.7}
        classNames="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-stretch gap-3 md:gap-6 lg:gap-12 px-2 py-6"
      >
        {loading
          ? // Show skeletons while loading
          Array.from({ length: 6 }).map((_, index) => (
            <MemberSkeleton key={`skeleton-member-${index}`} />
          ))
          : // Show actual team members when loaded
          team.map((member: TeamMember, index: number) => (
            <Member
              key={index}
              id={index}
              name={member.name}
              instagram={member.instagram}
              role={member.role}
              description={member.description}
              image={member.image}
            />
          ))}
      </AnimatedSection>

      <AnimatedSection delay={0.8} classNames="">
        <div className="text-center mb-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-3 text-gray-900">Our
        {" "}<span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent drop-shadow-sm pr-2 pb-1">Impact</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600">
            Making a real difference in the Memphis community
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ImpactCard
            icon={Users}
            stat="150+"
            label="Youth Empowered"
            index={0}
          />
          <ImpactCard
            icon={Film}
            stat="10"
            label="Projects Created"
            index={1}
          />
          <ImpactCard icon={Award} stat="12" label="Events Hosted" index={2} />
          <ImpactCard
            icon={Heart}
            stat="2K+"
            label="Lives Touched"
            index={3}
          />
        </div>
      </AnimatedSection>

      <AnimatedSection
        delay={0.9}
        classNames="max-w-5xl mx-auto w-full bg-white"
      >
        <div className="max-w-7xl mx-auto pb-12">
          <div className="relative overflow-hidden rounded-[3rem] bg-white p-8 md:p-16 text-center ring-1 ring-gray-400/40 isolation-auto">

            {/* Dynamic brand background effects */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[30rem] h-[30rem] bg-blue-50/90 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[25rem] h-[25rem] bg-teal-50/90 rounded-full blur-3xl pointer-events-none animate-pulse-slow [animation-delay:2s]"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-gray-900">
                Want to <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent pr-1">get Involved?</span>
              </h2>

              <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
                Your support helps us empower Memphis youth to create, grow, and thrive through art, film, and music.
              </p>

              <div className="flex flex-wrap gap-5 justify-center">
                <Link
                  href="/contact"
                  className="group relative inline-flex h-14 items-center justify-center gap-3 bg-gray-900 text-white px-10 rounded-full font-bold text-lg border border-black hover:bg-black/80  hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Contact Us
                </Link>

                <a
                  href="https://givebutter.com/auElnc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex h-14 items-center justify-center gap-3 border border-gray-200 bg-white text-gray-700 px-10 rounded-full font-bold text-lg hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 hover:scale-[1.02] transition-all"
                >
                  <Heart className="w-5 h-5 text-red-500" />
                  Donate Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
