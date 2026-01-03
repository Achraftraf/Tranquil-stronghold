"use client";

import {
  AnimatedSection,
  AnimatedSectionH,
} from "@/components/animations/animated-section";
import Member from "@/components/memeber";
import MemberSkeleton from "@/components/member-skeleton";
import { Heart, Film, Users, Mail, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { getTeamMembers } from "@/lib/strapi";
import { TeamMember } from "@/types";
import { ImpactCard } from "@/components/impact-card";

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
    <section className="w-full min-h-screen bg-white text-black max-w-5xl mx-auto p-10  space-y-18">
      <AnimatedSection delay={0.1} classNames="text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-blue-500">
          About Steadfast Haven
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Empowering Memphis youth to tell their stories and build their futures
          through creative expression.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full -ml-24 -mb-24" />
          </div>
          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="inline-block bg-blue-500 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Are</h2>
            <p className="text-lg text-gray-200 leading-relaxed mb-6 max-w-3xl">
              Steadfast Haven is a Memphis-based 501(c)(3) nonprofit that
              empowers underserved youth through art, film, and music. We offer
              safe creative spaces for young people to tell their stories,
              develop real-world skills, and drive community change.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <div className="text-sm text-gray-300">Location</div>
                <div className="text-lg font-semibold">Memphis, TN</div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.6} classNames="text-center">
        <h2 className="text-4xl font-bold mb-3 text-gray-900">Meet Our Team</h2>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Steadfast Haven is led by a passionate and mission-driven team
          committed to creating lasting impact through strategic leadership,
          clear communication, and strong community connections.
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
          <h2 className="text-4xl font-bold mb-3 text-gray-900">Our Impact</h2>
          <p className="text-lg text-gray-600">
            Making a real difference in the Memphis community
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ImpactCard
            icon={Users}
            stat="200+"
            label="Youth Empowered"
            index={0}
          />
          <ImpactCard
            icon={Film}
            stat="50+"
            label="Projects Created"
            index={1}
          />
          <ImpactCard icon={Award} stat="15+" label="Events Hosted" index={2} />
          <ImpactCard
            icon={Heart}
            stat="10K+"
            label="Lives Touched"
            index={3}
          />
        </div>
      </AnimatedSection>

      <AnimatedSectionH
        delay={0.9}
        classNames="max-w-5xl mx-auto w-full bg-white"
      >
        <div className="max-w-7xl mx-auto pb-12">
          <div className="relative overflow-hidden rounded-[3rem] bg-white p-8 md:p-16 text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] ring-1 ring-gray-200/50 isolation-auto">

            {/* Dynamic brand background effects */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[30rem] h-[30rem] bg-blue-50/50 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[25rem] h-[25rem] bg-teal-50/50 rounded-full blur-3xl pointer-events-none animate-pulse-slow [animation-delay:2s]"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-gray-900">
                Want to <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent pr-1">get Involved?</span>
              </h2>

              <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
                Your support helps us empower Memphis youth to create, grow, and thrive through art, film, and music.
              </p>

              <div className="flex flex-wrap gap-5 justify-center">
                <a
                  href="mailto:admin@steadfasthaven.org"
                  className="group relative inline-flex h-14 items-center justify-center gap-3 bg-gray-900 text-white px-10 rounded-full font-bold text-lg hover:bg-black hover:shadow-xl hover:shadow-gray-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Contact Us
                </a>

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
      </AnimatedSectionH>
    </section>
  );
}
