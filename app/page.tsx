"use client"

import { AnimatedSection, AnimatedSectionH } from "@/components/animations/animated-section";
import { AnimatedContactInfoItem } from "@/components/animations/animated-contact-info";
import Card from "@/components/card";
import Link from "next/link";
import { FaDonate, FaSpinner } from "react-icons/fa";
import { FiCalendar, FiHeart, FiUsers } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import { PiPalette } from "react-icons/pi";
import SpaceAdventureGame from "@/components/space-advanture";
import { useEffect, useState } from "react";
import FlyingRocket from "@/components/flying-rocket";
import { RiTeamLine } from "react-icons/ri";
import { GoArrowRight } from "react-icons/go";
import { getHomeCards } from "@/lib/strapi";
import { ImSpinner2 } from "react-icons/im";


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
  const [loading, setLoading] = useState(false);

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
    // Reset the rocket after a short delay
    setTimeout(() => {
      setShowRocket(true);
    }, 500);
  };

  const topCards = cards.filter(card => card.cardId <= 2);
  const bottomCards = cards.filter(card => card.cardId > 2);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <ImSpinner2 className="text-3xl text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <section className="w-full flex-1 min-h-0 flex flex-col items-center justify-start bg-white text-black">
      {showRocket && (
        <FlyingRocket
          onCatch={() => {
            setShowRocket(false);
            setPlay(true);
          }}
        />
      )}
      {
        play && (
          <SpaceAdventureGame handleClose={handleCloseGame} />
        )
      }
      <div className='flex-1 min-h-0 mx-auto px-3 w-full flex flex-row items-center justify-center mb-4'>
        <AnimatedSection
          delay={0.6}
          classNames="pt-14 pb-4 mb-12 w-full flex flex-col items-center text-center space-y-6"
        >
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight max-w-4xl">
            Empowering Youth Through<br />Art, Film & Music
          </h2>
          <div className="flex items-center gap-4 mt-4">
            <Link
              href="/team"
              className="text-xl px-6 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition border-2 border-blue-500"
            >
              Join Us
            </Link>
            <Link
              href="/about"
              className="group relative text-xl px-6 py-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition"
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

      <AnimatedSectionH
        classNames="w-full min-h-screen overflow-hidden bg-white rounded-t-[23rem] md:rounded-t-[20rem]  lg:rounded-t-[90%] border-t border-t-neutral-300 p-8 pb-4 text-center"
      >
        <AnimatedSection delay={0.3} classNames="w-full px-6 py-2 bg-white">
          <a target="_blank" href={"https://givebutter.com/auElnc"} className="inline-flex border border-neutral-300 items-center gap-2 bg-white px-4 py-1 rounded-full text-xs sm:text-sm font-medium text-blue-600 mb-6 hover:underline hover:underline-blue-500">
            <FaDonate className="w-4 h-4" />
            Donate
          </a>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-semibold mb-3">Our Mission</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Steadfast Haven is a Memphis-based nonprofit empowering youth through
              creative freedom. We provide safe spaces where young people can learn,
              create, and share their stories — and discover a future they believe in.
            </p>
          </div>
        </AnimatedSection>

        <div className="w-full md:max-w-5xl mx-auto grid grid-cols-1 gap-8 lg:gap-14 px-2 md:px-8 py-2 md:py-6 lg:py-8 lg:px-14 my-2 lg:my-6">

          {topCards.map((card, index) => (
            <AnimatedContactInfoItem key={card.id} delay={0.4 + index * 0.2}>
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


      <AnimatedSectionH
        classNames="w-full overflow-hidden bg-white rounded-b-[23rem] md:rounded-b-[20rem]  lg:rounded-b-[90%] border-b border-b-neutral-300 px-8 pb-8 mb-8 text-center"
      >
        <div className="w-full md:max-w-5xl mx-auto grid grid-cols-1 gap-8 lg:gap-14 px-2 md:px-8 pb-8 lg:px-14 my-8">
          {bottomCards.map((card, index) => (
            <AnimatedContactInfoItem key={card.id} delay={0.6 + index * 0.2}>
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
        <a target="_blank" href={"/team"} className="inline-flex border border-neutral-300 items-center gap-2 bg-white px-4 py-1 rounded-full text-xs sm:text-sm font-medium text-blue-600 mb-6 hover:underline hover:underline-blue-500">
          <RiTeamLine className="w-4 h-4" />
          Join our Team
        </a>
      </AnimatedSectionH>

      <AnimatedSectionH delay={0.2} classNames="max-w-5xl mx-auto w-full px-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
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
      </AnimatedSectionH>

    </section >
  );
}


