"use client";

import {
  AnimatedSection,
  AnimatedSectionH,
} from "@/components/animations/animated-section";
import { AnimatedContactInfoItem } from "@/components/animations/animated-contact-info";
import Card from "@/components/card";
import CardSkeleton from "@/components/card-skeleton";
import Link from "next/link";
import { FaDonate } from "react-icons/fa";
import { FiCalendar, FiHeart, FiUsers } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import { PiPalette } from "react-icons/pi";
import SpaceAdventureGame from "@/components/space-advanture";
import { useEffect, useState } from "react";
import FlyingRocket from "@/components/flying-rocket";
import { RiTeamLine } from "react-icons/ri";
import { GoArrowRight } from "react-icons/go";
import { getHomeCards } from "@/lib/strapi";
import ParticlesContainer from "@/components/ParticlesContainer";

// Icon mapping
const iconMap: { [key: string]: any } = {
  FiCalendar: FiCalendar,
  FiHeart: FiHeart,
  FiUsers: FiUsers,
  PiPalette: PiPalette,
};

export default function Home() {
  const [play, setPlay] = useState(false);
  const [showRocket, setShowRocket] = useState(true);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCards() {
      try {
        setLoading(true);
        const data = await getHomeCards();
        console.log("Fetched cards:", data);
        setCards(data);
      } catch (error) {
        console.error("Error loading cards:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, []);

  const handleCloseGame = () => {
    setPlay(false);
    setTimeout(() => {
      setShowRocket(true);
    }, 1200); // Wait for genie close animation (800ms) + buffer
  };
  const topCards = cards.filter((card) => card.cardId <= 2);
  const bottomCards = cards.filter((card) => card.cardId > 2);

  // Use default skeleton counts when loading (2 top, 2 bottom)
  const topSkeletonCount = 2;
  const bottomSkeletonCount = 2;

  return (
    <section className="w-full flex-1 min-h-0 flex flex-col items-center justify-start bg-white text-black relative">
      {/* Particles in the background - only on this page */}
      <ParticlesContainer style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

      <div className="relative z-10 w-full flex-1 min-h-0 flex flex-col items-center justify-start">
        {showRocket && (
          <FlyingRocket
            onCatch={() => {
              setShowRocket(false);
              setPlay(true);
            }}
          />
        )}
        {play && <SpaceAdventureGame handleClose={handleCloseGame} />}

        <div className="flex-1 min-h-0 mx-auto px-3 w-full flex flex-row items-center justify-center mb-4">
          <AnimatedSection
            delay={0.6}
            classNames="pt-14 pb-4 mb-12 w-full flex flex-col items-center text-center space-y-6"
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight max-w-4xl">
              Empowering Youth Through
              <br />
              Art, Film & Music
            </h2>
            <div className="flex items-center gap-4 mt-4">
              <Link
                href="/events#join-us"
                className="text-xl px-6 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/30 transition border-none"
              >
                Join Us
              </Link>
              <Link
                href="/about"
                className="group relative text-xl px-6 py-2 rounded-full border-2 border-teal-500 text-teal-600 hover:bg-teal-50 transition"
              >
                Learn More
                <IoChevronForward
                  className="
          inline-block ml-2 mb-[3px] 
          transition-all duration-300
          group-hover:opacity-0 group-hover:translate-x-1
        "
                />
                <GoArrowRight
                  className="
          inline-block size-6  -ml-4  absolute top-0 bottom-0 m-auto
          opacity-0 translate-x-[-4px]
          transition-all duration-700
          group-hover:opacity-100 group-hover:translate-x-0
        "
                />
              </Link>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSectionH classNames="w-full min-h-screen overflow-hidden bg-white rounded-t-[23rem] md:rounded-t-[20rem]  lg:rounded-t-[90%] border-t border-t-neutral-300 p-8 pb-4 text-center">
          <AnimatedSection delay={0.3} classNames="w-full px-6 py-2 bg-white">
            <a
              target="_blank"
              href={"https://givebutter.com/auElnc"}
              className="inline-flex border border-teal-100 items-center gap-2 bg-teal-50/50 px-4 py-1 rounded-full text-xs sm:text-sm font-medium text-teal-700 mb-6 hover:bg-teal-100 transition-colors"
            >
              <FaDonate className="w-4 h-4 text-teal-600" />
              Donate
            </a>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-semibold mb-3">Our Mission</h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                Steadfast Haven is a Memphis-based nonprofit empowering youth
                through creative freedom. We provide safe spaces where young
                people can learn, create, and share their stories — and discover a
                future they believe in.
              </p>
            </div>
          </AnimatedSection>

          <div className="w-full md:max-w-5xl mx-auto grid grid-cols-1 gap-8 lg:gap-14 px-2 md:px-8 py-2 md:py-6 lg:py-8 lg:px-14 my-2 lg:my-6">
            {loading
              ? // Show skeletons while loading
              Array.from({ length: topSkeletonCount }).map((_, index) => (
                <AnimatedContactInfoItem
                  key={`skeleton-top-${index}`}
                  delay={0.4 + index * 0.2}
                >
                  <CardSkeleton left={index % 2 === 0} />
                </AnimatedContactInfoItem>
              ))
              : // Show actual cards when loaded
              topCards.map((card, index) => (
                <AnimatedContactInfoItem
                  key={card.id}
                  delay={0.4 + index * 0.2}
                >
                  <Card
                    id={card.cardId}
                    title={card.title}
                    desc={card.description}
                    icon={iconMap[card.icon] || FiCalendar}
                    left={index % 2 == 0}
                  />
                </AnimatedContactInfoItem>
              ))}
          </div>
        </AnimatedSectionH>

        <AnimatedSectionH classNames="w-full overflow-hidden bg-white rounded-b-[23rem] md:rounded-b-[20rem]  lg:rounded-b-[90%] border-b border-b-neutral-300 px-8 pb-8 mb-8 text-center">
          <div className="w-full md:max-w-5xl mx-auto grid grid-cols-1 gap-8 lg:gap-14 px-2 md:px-8 pb-8 lg:px-14 my-8">
            {loading
              ? // Show skeletons while loading
              Array.from({ length: bottomSkeletonCount }).map((_, index) => (
                <AnimatedContactInfoItem
                  key={`skeleton-bottom-${index}`}
                  delay={0.6 + index * 0.2}
                >
                  <CardSkeleton left={index % 2 === 0} />
                </AnimatedContactInfoItem>
              ))
              : // Show actual cards when loaded
              bottomCards.map((card, index) => (
                <AnimatedContactInfoItem
                  key={card.id}
                  delay={0.6 + index * 0.2}
                >
                  <Card
                    id={card.cardId}
                    title={card.title}
                    desc={card.description}
                    icon={iconMap[card.icon] || FiCalendar}
                    left={index % 2 == 0}
                  />
                </AnimatedContactInfoItem>
              ))}
          </div>
          <a
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLSc7sCv5f35LvLNNqXc_XzK2fNKGMniHx3hmFkwZHve0IOpAew/viewform?usp=dialog"
            rel="noopener noreferrer"
            className="inline-flex border border-teal-100 items-center gap-2 bg-teal-50/50 px-4 py-1 rounded-full text-xs sm:text-sm font-medium text-teal-700 mb-6 hover:bg-teal-100 transition-colors"
          >
            <RiTeamLine className="w-4 h-4 text-teal-600" />
            Join our Team
          </a>
        </AnimatedSectionH>

        <AnimatedSectionH
          delay={0.2}
          classNames="max-w-5xl mx-auto w-full px-6 "
        >
          <div className="max-w-7xl mx-auto px-6 py-14">
            <div className="relative overflow-hidden rounded-[3rem] bg-white p-8  ring-1 ring-blue-900/15 sm:p-20 md:p-24 isolation-auto">

              {/* Dynamic brand background effects */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[50rem] h-[50rem] bg-gradient-to-br from-blue-100/50 via-teal-100/40 to-cyan-100/30 rounded-full blur-3xl opacity-70 animate-pulse-slow mix-blend-multiply"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[45rem] h-[45rem] bg-gradient-to-tr from-cyan-100/50 via-blue-100/40 to-teal-100/30 rounded-full blur-3xl opacity-70 animate-pulse-slow [animation-delay:2s] mix-blend-multiply"></div>

              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="mb-8 inline-flex items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold tracking-wide text-blue-600 ring-1 ring-inset ring-blue-600/20 transition-all hover:bg-blue-100 hover:scale-105 cursor-default shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                  </span>
                  Partner With Us
                </span>

                <h2 className="mb-8 max-w-4xl text-5xl font-black tracking-tighter text-gray-900 sm:text-6xl md:text-7xl">
                  Ready to <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">Make an Impact?</span>
                </h2>

                <p className="mb-12 max-w-2xl text-lg font-medium leading-relaxed text-gray-600 sm:text-xl">
                  Join a passionate community of mentors and creators. Your support can spark the creativity that defines a young person's future.
                </p>

                <div className="flex flex-col flex-wrap justify-center gap-4 sm:flex-row w-full sm:w-auto">
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSc7sCv5f35LvLNNqXc_XzK2fNKGMniHx3hmFkwZHve0IOpAew/viewform?usp=dialog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl px-10 py-3.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/30 transition border-none flex items-center gap-2"
                  >
                    <span>Get Involved</span>
                    <GoArrowRight />
                  </a>

                  <a
                    href="mailto:admin@steadfasthaven.org"
                    className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-10 text-base font-bold text-gray-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 hover:scale-[1.02]"
                  >
                    Contact Team
                  </a>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSectionH>
      </div >
    </section >
  );
}
