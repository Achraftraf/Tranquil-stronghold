"use client";

import React, { useState, useEffect } from "react";
import { FaDonate } from "react-icons/fa";
import { FiCalendar, FiHeart, FiUsers } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import { PiPalette } from "react-icons/pi";
import { RiTeamLine } from "react-icons/ri";
import { GoArrowRight } from "react-icons/go";
import { Rocket, Star, X, Trophy, Heart, Flame } from 'lucide-react';

// Simplified Card Component
const Card = ({ title, desc, icon: Icon, left }: any) => (
  <div className={`flex ${left ? 'flex-row' : 'flex-row-reverse'} gap-4 items-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm`}>
    <div className="p-4 bg-blue-50 rounded-xl">
      <Icon className="w-8 h-8 text-blue-500" />
    </div>
    <div className={left ? 'text-left' : 'text-right'}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  </div>
);

// Flying Rocket Component
const FlyingRocket = ({ onCatch }: { onCatch: () => void }) => {
  const [position, setPosition] = useState({ x: 10, y: 20 });
  const [caught, setCaught] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => ({
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setCaught(true);
    setTimeout(() => onCatch(), 300);
  };

  if (caught) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed z-50 transition-all duration-[2000ms] ease-in-out hover:scale-125 cursor-pointer"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Rocket className="w-12 h-12 text-blue-500 drop-shadow-lg animate-bounce" />
    </button>
  );
};

// Space Adventure Game Component
const SpaceAdventureGame = ({ handleClose }: { handleClose?: () => void }) => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      handleClose?.();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none perspective-container">
      {/* Epic Backdrop */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-black/70 via-blue-950/40 to-purple-950/40 backdrop-blur-md pointer-events-auto ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
        onClick={handleCloseClick} 
      />
      
      <div 
        className={`
          relative w-full max-w-2xl h-[85vh] max-h-[700px]
          bg-gradient-to-br from-[#0a0e17] via-[#05070a] to-[#0d1117]
          rounded-3xl overflow-hidden 
          border border-white/20
          shadow-[0_30px_90px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1)]
          pointer-events-auto
          ${isClosing ? 'animate-epic-close' : 'animate-epic-open'}
        `}
      >
        {/* Subtle ambient effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        {/* HUD */}
        <div className="absolute top-6 inset-x-8 flex justify-between items-start z-40 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-xl border border-white/20 shadow-lg">
            <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Score</p>
            <p className="text-2xl font-black text-white italic">{score.toLocaleString()}</p>
          </div>
          
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-2 rounded-xl backdrop-blur-xl border border-white/20 bg-red-500/30 text-red-400">
                <Heart size={20} fill="currentColor" strokeWidth={2.5} />
              </div>
            ))}
            <button onClick={handleCloseClick} className="p-2 bg-white/10 backdrop-blur-xl rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 pointer-events-auto shadow-lg">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Game Content */}
        {!gameStarted ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05070a]/90 backdrop-blur-md z-50 p-12 text-center">
            <h1 className="text-5xl font-black text-white italic tracking-tighter mb-3">
              SPACE ADVENTURE
            </h1>
            <p className="text-white/50 text-sm mb-10 tracking-widest uppercase">
              Navigator System Online
            </p>
            <button 
              onClick={() => setGameStarted(true)}
              className="px-12 py-5 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 uppercase tracking-tighter text-lg shadow-xl"
            >
              Launch Vessel
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/40 text-lg">Game Running...</p>
          </div>
        )}
      </div>

      <style>{`
        .perspective-container {
          perspective: 2000px;
        }
        
        @keyframes epic-open {
          0% { 
            opacity: 0;
            transform: scale(0.7) translateY(100px) rotateX(15deg);
            filter: blur(20px);
          }
          40% {
            opacity: 1;
            filter: blur(0px);
          }
          70% {
            transform: scale(1.02) translateY(-10px) rotateX(-2deg);
          }
          100% { 
            opacity: 1;
            transform: scale(1) translateY(0) rotateX(0deg);
            filter: blur(0px);
          }
        }
        
        @keyframes epic-close {
          0% { 
            opacity: 1;
            transform: scale(1) translateY(0) rotateX(0deg);
            filter: blur(0px);
          }
          30% {
            transform: scale(0.98) translateY(10px) rotateX(-5deg);
          }
          100% { 
            opacity: 0;
            transform: scale(0.6) translateY(150px) rotateX(20deg);
            filter: blur(25px);
          }
        }
        
        @keyframes backdrop-in {
          0% { 
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          100% { 
            opacity: 1;
            backdrop-filter: blur(12px);
          }
        }
        
        @keyframes backdrop-out {
          0% { 
            opacity: 1;
            backdrop-filter: blur(12px);
          }
          100% { 
            opacity: 0;
            backdrop-filter: blur(0px);
          }
        }
        
        .animate-epic-open { 
          animation: epic-open 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-style: preserve-3d;
        }
        .animate-epic-close { 
          animation: epic-close 0.6s cubic-bezier(0.7, 0, 0.84, 0) forwards;
          transform-style: preserve-3d;
        }
        .animate-backdrop-in { 
          animation: backdrop-in 0.6s ease-out forwards; 
        }
        .animate-backdrop-out { 
          animation: backdrop-out 0.5s ease-in forwards; 
        }
      `}</style>
    </div>
  );
};

// Main Home Component
export default function Home() {
  const [play, setPlay] = useState(false);
  const [showRocket, setShowRocket] = useState(true);

  const handleCloseGame = () => {
    setPlay(false);
    setTimeout(() => {
      setShowRocket(true);
    }, 700);
  };

  const mockCards = [
    { id: 1, cardId: 1, title: "Creative Workshops", description: "Monthly art, film, and music sessions", icon: "PiPalette" },
    { id: 2, cardId: 2, title: "Community Events", description: "Showcasing youth talent and creativity", icon: "FiCalendar" },
    { id: 3, cardId: 3, title: "Mentorship", description: "Connecting youth with industry professionals", icon: "FiUsers" },
    { id: 4, cardId: 4, title: "Safe Spaces", description: "Supportive environment for self-expression", icon: "FiHeart" },
  ];

  const iconMap: any = {
    FiCalendar, FiHeart, FiUsers, PiPalette
  };

  const topCards = mockCards.filter(card => card.cardId <= 2);
  const bottomCards = mockCards.filter(card => card.cardId > 2);

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start bg-white text-black relative overflow-x-hidden">
      {showRocket && (
        <FlyingRocket
          onCatch={() => {
            setShowRocket(false);
            setPlay(true);
          }}
        />
      )}
      
      {play && <SpaceAdventureGame handleClose={handleCloseGame} />}
      
      {/* Hero Section */}
      <div className="w-full flex items-center justify-center py-20 px-4">
        <div className="text-center space-y-6 max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            Empowering Youth Through
            <br />
            Art, Film & Music
          </h2>
          <div className="flex items-center gap-4 justify-center mt-4">
            <button className="text-xl px-6 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition border-2 border-blue-500">
              Join Us
            </button>
            <button className="group relative text-xl px-6 py-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition">
              Learn More
              <IoChevronForward className="inline-block ml-2 mb-[3px] transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-1" />
              <GoArrowRight className="inline-block w-6 h-6 -ml-4 absolute top-0 bottom-0 m-auto opacity-0 translate-x-[-4px] transition-all duration-700 group-hover:opacity-100 group-hover:translate-x-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="w-full bg-gray-50 rounded-t-[10rem] border-t border-gray-200 p-8 pb-4 text-center">
        <a
          href="https://givebutter.com/auElnc"
          target="_blank"
          className="inline-flex border border-gray-300 items-center gap-2 bg-white px-4 py-1 rounded-full text-sm font-medium text-blue-600 mb-6 hover:underline"
        >
          <FaDonate className="w-4 h-4" />
          Donate
        </a>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-semibold mb-3">Our Mission</h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Steadfast Haven is a Memphis-based nonprofit empowering youth
            through creative freedom. We provide safe spaces where young
            people can learn, create, and share their stories — and discover a
            future they believe in.
          </p>
        </div>

        {/* Cards Section */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8 px-4 py-12">
          {topCards.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              desc={card.description}
              icon={iconMap[card.icon]}
              left={card.cardId % 2 === 1}
            />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full bg-gray-50 rounded-b-[10rem] border-b border-gray-200 px-8 pb-8 mb-8 text-center">
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8 px-4 pb-8">
          {bottomCards.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              desc={card.description}
              icon={iconMap[card.icon]}
              left={card.cardId % 2 === 1}
            />
          ))}
        </div>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSc7sCv5f35LvLNNqXc_XzK2fNKGMniHx3hmFkwZHve0IOpAew/viewform?usp=dialog"
          target="_blank"
          className="inline-flex border border-gray-300 items-center gap-2 bg-white px-4 py-1 rounded-full text-sm font-medium text-blue-600 mb-6 hover:underline"
        >
          <RiTeamLine className="w-4 h-4" />
          Join our Team
        </a>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto w-full px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Want to Collaborate?</h2>
          <p className="text-xl mb-8 text-blue-50 max-w-2xl mx-auto">
            We're always looking for partners, mentors, and supporters who
            believe in empowering Memphis youth through creative expression.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSc7sCv5f35LvLNNqXc_XzK2fNKGMniHx3hmFkwZHve0IOpAew/viewform?usp=dialog"
              target="_blank"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all"
            >
              Get Involved
            </a>
            <a
              href="mailto:admin@steadfasthaven.org"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}