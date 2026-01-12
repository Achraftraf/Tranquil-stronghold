"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Rocket, Sparkles, Star, Zap } from "lucide-react";

interface FlyingRocketProps {
  onCatch: () => void;
}

export default function FlyingRocket({ onCatch }: FlyingRocketProps) {
  const [visible, setVisible] = useState(true);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number }>>([]);
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [missed, setMissed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [missCount, setMissCount] = useState(0);
  const [speedBoost, setSpeedBoost] = useState(false);

  const positionRef = useRef({ x: 50, y: 40 });
  const angleRef = useRef(0);
  const directionRef = useRef(Math.random() * 360);
  const speedRef = useRef(0.22); // Intermediate speed - perfect balance
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const particleIdRef = useRef(0);
  const starIdRef = useRef(0);
  const lastParticleTime = useRef(0);
  const rocketElementRef = useRef<HTMLDivElement>(null);
  const exhaustRef = useRef<HTMLDivElement>(null);

  // Update DOM directly for smooth animation
  const updateRocketPosition = useCallback(() => {
    if (rocketElementRef.current) {
      const { x, y } = positionRef.current;
      rocketElementRef.current.style.left = `${x}%`;
      rocketElementRef.current.style.top = `${y}%`;
      rocketElementRef.current.style.transform = `translate(-50%, -50%)`;

      const innerElement = rocketElementRef.current.querySelector('.rocket-inner') as HTMLElement;
      if (innerElement) {
        innerElement.style.transform = `rotate(${angleRef.current}deg)`;
      }

      // GPU-accelerated transform
      rocketElementRef.current.style.transform = `translate3d(-50%, -50%, 0)`;
      rocketElementRef.current.style.willChange = 'left, top';

      // Animate exhaust
      if (exhaustRef.current) {
        const pulse = Math.sin(timeRef.current * 0.2) * 0.3 + 1;
        exhaustRef.current.style.transform = `translateX(-50%) rotate(${-angleRef.current}deg) translateY(22px) scale(${pulse})`;
      }
    }
  }, []);

  const createStarBurst = (x: number, y: number) => {
    // Reduced from 6 to 3 stars for better performance
    const newStars = Array.from({ length: 3 }, (_, i) => ({
      id: starIdRef.current++,
      x: x + (Math.random() - 0.5) * 3,
      y: y + (Math.random() - 0.5) * 3,
    }));
    setStars(prev => [...prev, ...newStars]);
    // Reduced timeout from 800ms to 600ms
    setTimeout(() => {
      setStars(prev => prev.filter(s => !newStars.find(ns => ns.id === s.id)));
    }, 600);
  };

  const animate = useCallback(() => {
    timeRef.current += 1;

    // Balanced organic movement
    const wobbleX = Math.sin(timeRef.current * 0.04) * 4 + Math.cos(timeRef.current * 0.06) * 2;
    const wobbleY = Math.cos(timeRef.current * 0.035) * 4 + Math.sin(timeRef.current * 0.05) * 2;

    // Moderate direction changes
    directionRef.current +=
      Math.sin(timeRef.current * 0.004) * 0.6 +
      Math.cos(timeRef.current * 0.006) * 0.3;

    const rad = (directionRef.current * Math.PI) / 180;
    const nx = positionRef.current.x + Math.cos(rad) * speedRef.current + wobbleX * 0.08;
    const ny = positionRef.current.y + Math.sin(rad) * speedRef.current + wobbleY * 0.08;

    let nextX = nx;
    let nextY = ny;

    // Optimized bounce with smoother direction change
    if (nx < 8 || nx > 92) {
      directionRef.current = 180 - directionRef.current + (Math.random() - 0.5) * 18;
      speedRef.current = 0.22 + Math.random() * 0.04; // Maintain balanced speed after bounce
      nextX = Math.max(8, Math.min(nx, 92));
      // Only create burst every other bounce to reduce lag
      if (Math.random() > 0.5) createStarBurst(nextX, nextY);
    }
    if (ny < 8 || ny > 82) {
      directionRef.current = -directionRef.current + (Math.random() - 0.5) * 18;
      speedRef.current = 0.22 + Math.random() * 0.04;
      nextY = Math.max(8, Math.min(ny, 82));
      if (Math.random() > 0.5) createStarBurst(nextX, nextY);
    }

    positionRef.current = { x: nextX, y: nextY };

    // Balanced rotation for smooth movement
    const targetAngle = directionRef.current;
    const angleDiff = targetAngle - angleRef.current;
    angleRef.current += angleDiff * 0.15; // Balanced rotation speed

    updateRocketPosition();

    // Create enhanced particle trail (reduced frequency for performance)
    if (timeRef.current - lastParticleTime.current > 5) {
      lastParticleTime.current = timeRef.current;
      setParticles((prev) => {
        const newParticle = {
          id: particleIdRef.current++,
          x: nextX + (Math.random() - 0.5) * 2,
          y: nextY + (Math.random() - 0.5) * 2,
          angle: angleRef.current + (Math.random() - 0.5) * 30
        };
        return [...prev.slice(-8), newParticle]; // Reduced from 12 to 8
      });
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [updateRocketPosition]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    const tooltipTimer = setTimeout(() => setShowTooltip(true), 2000);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      clearTimeout(tooltipTimer);
    };
  }, [animate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => prev.slice(-8));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleCatch = () => {
    // Celebration effect
    createStarBurst(positionRef.current.x, positionRef.current.y);
    setVisible(false);
    setTimeout(() => onCatch(), 400);
  };

  const handleMiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMissCount((prev) => prev + 1);
    setMissed(true);
    setShowTooltip(false);

    // Speed boost activation
    if ((missCount + 1) % 2 === 0) {
      speedRef.current = Math.min(speedRef.current + 0.03, 0.8); // moderate speed boost
      setSpeedBoost(true);
      setTimeout(() => setSpeedBoost(false), 2000);
    }

    // Smoother evasive maneuver - reduced from 120 to 80 degrees
    directionRef.current += (Math.random() - 0.5) * 80;
    // Only create burst 50% of the time to reduce lag
    if (Math.random() > 0.5) createStarBurst(positionRef.current.x, positionRef.current.y);

    setTimeout(() => {
      setMissed(false);
      setShowTooltip(true);
    }, 500);
  };

  if (!visible) return null;

  return (
    <>
      {/* Enhanced Particle Trail */}
      {particles.map((particle, index) => {
        const opacity = (index + 1) / particles.length;
        const scale = 0.3 + opacity * 0.7;
        return (
          <div
            key={particle.id}
            className="fixed pointer-events-none z-[99] will-change-transform"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: opacity * 0.5,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${particle.angle}deg)`,
              transition: 'opacity 0.6s ease-out, transform 0.4s ease-out',
            }}
          >
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-400 via-teal-500 to-cyan-500 blur-[2px]"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-white/30 animate-ping" style={{ animationDuration: '1s' }}></div>
            </div>
          </div>
        );
      })}

      {/* Star Burst Effect */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="fixed pointer-events-none z-[99] animate-star-burst"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
        >
          <Sparkles className="w-3 h-3 text-yellow-300" />
        </div>
      ))}

      {/* Main Rocket */}
      <div
        ref={rocketElementRef}
        className={`fixed z-[100] transition-none will-change-transform ${missed ? 'scale-90 opacity-70' : 'scale-100'
          }`}
        style={{
          left: '50%',
          top: '40%',
          transform: 'translate3d(-50%, -50%, 0)', // GPU acceleration
        }}
      >
        <button
          onClick={handleCatch}
          onMouseDown={handleMiss}
          className="group cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200 relative"
          aria-label="Catch the flying rocket"
        >
          <div className="relative">
            {/* Animated rotating glow rings */}
            <div className="absolute -inset-7 rounded-full bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-cyan-500/20 blur-xl opacity-60 animate-spin-slow"></div>
            <div className="absolute -inset-5 rounded-full bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-teal-500/15 blur-lg opacity-50 animate-spin-reverse"></div>

            {/* Pulsing glow */}
            <div className="absolute -inset-4 rounded-full bg-teal-500/10 animate-pulse-glow"></div>

            {/* Sparkle orbits */}
            <div className="absolute -inset-6 animate-spin-slow">
              <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 text-teal-300 animate-twinkle" />
            </div>
            <div className="absolute -inset-6 animate-spin-reverse" style={{ animationDuration: '4s' }}>
              <Star className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 text-cyan-300 animate-twinkle" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute -inset-6 animate-spin-slow" style={{ animationDuration: '5s' }}>
              <Zap className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-emerald-300 animate-twinkle" style={{ animationDelay: '1s' }} />
            </div>

            {/* Premium Rocket Container with advanced effects */}
            <div className="rocket-inner relative p-4 rounded-full shadow-2xl bg-gradient-to-br from-blue-500 via-teal-500 to-cyan-600 border-2 border-white/50 transition-all duration-150 overflow-hidden">
              {/* Animated shimmer overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>

              {/* Inner glow layers for depth */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-white/30 via-transparent to-transparent"></div>

              {/* Premium Animated SVG Rocket */}
              <div className="relative">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 40 60"
                  className="relative z-10 drop-shadow-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                >
                  <defs>
                    {/* Main body gradient - Blue to Cyan */}
                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="30%" stopColor="#e0f2fe" />
                      <stop offset="70%" stopColor="#bae6fd" />
                      <stop offset="100%" stopColor="#7dd3fc" />
                    </linearGradient>

                    {/* Animated shine gradient */}
                    <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0">
                        <animate attributeName="stop-opacity" values="0;0.9;0" dur="3s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4">
                        <animate attributeName="stop-opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0">
                        <animate attributeName="stop-opacity" values="0;0.9;0" dur="3s" repeatCount="indefinite" />
                      </stop>
                      <animateTransform
                        attributeName="gradientTransform"
                        type="rotate"
                        from="0 20 30"
                        to="360 20 30"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>

                    {/* Window glow - Animated Cyan */}
                    <radialGradient id="windowGlow">
                      <stop offset="0%" stopColor="#22d3ee">
                        <animate attributeName="stop-color" values="#22d3ee;#38bdf8;#22d3ee" dur="2s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#0891b2" />
                    </radialGradient>

                    {/* Wing gradient - Teal */}
                    <linearGradient id="wingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>

                    {/* Accent gradient - Blue */}
                    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>

                    {/* Energy ring gradient */}
                    <radialGradient id="energyGrad">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Animated energy rings */}
                  <circle cx="20" cy="30" r="18" fill="none" stroke="url(#energyGrad)" strokeWidth="1" opacity="0.6">
                    <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="20" cy="30" r="20" fill="none" stroke="url(#energyGrad)" strokeWidth="0.5" opacity="0.4">
                    <animate attributeName="r" values="20;24;20" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite" />
                  </circle>

                  {/* Main rocket body */}
                  <path
                    d="M20 0C10 15 5 35 5 50H35C35 35 30 15 20 0Z"
                    fill="url(#bodyGrad)"
                    stroke="#38bdf8"
                    strokeWidth="0.5"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      values="1;1.02;1"
                      dur="3s"
                      additive="sum"
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Inner body detail */}
                  <path
                    d="M20 5C14 20 10 35 10 45H30C30 35 26 20 20 5Z"
                    fill="#f0f9ff"
                    opacity="0.7"
                  />

                  {/* Animated shine sweep */}
                  <ellipse
                    cx="18"
                    cy="20"
                    rx="6"
                    ry="14"
                    fill="url(#shineGrad)"
                    opacity="0.7"
                  />

                  {/* Cockpit window with pulsing glow */}
                  <circle
                    cx="20"
                    cy="22"
                    r="6"
                    fill="url(#windowGlow)"
                    opacity="0.95"
                  >
                    <animate
                      attributeName="r"
                      values="6;6.3;6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.95;1;0.95"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="20" cy="22" r="4" fill="#a5f3fc" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;1;0.9" dur="1.5s" repeatCount="indefinite" />
                  </circle>

                  {/* Animated window reflection */}
                  <ellipse
                    cx="18"
                    cy="20"
                    rx="2"
                    ry="3"
                    fill="#ffffff"
                    opacity="0.8"
                  >
                    <animate attributeName="opacity" values="0.8;0.5;0.8" dur="2s" repeatCount="indefinite" />
                  </ellipse>

                  {/* Left wing - with subtle animation */}
                  <path
                    d="M5 35L0 55L5 50Z"
                    fill="url(#wingGrad)"
                    stroke="#0f766e"
                    strokeWidth="0.5"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0 5 42.5;-2 5 42.5;0 5 42.5"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Right wing - with subtle animation */}
                  <path
                    d="M35 35L40 55L35 50Z"
                    fill="url(#wingGrad)"
                    stroke="#0f766e"
                    strokeWidth="0.5"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0 35 42.5;2 35 42.5;0 35 42.5"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Wing highlights - animated */}
                  <path d="M5 35L2 45L5 43Z" fill="#5eead4" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" />
                  </path>
                  <path d="M35 35L38 45L35 43Z" fill="#5eead4" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" />
                  </path>

                  {/* Body details/stripes - pulsing */}
                  <rect x="18" y="32" width="4" height="8" rx="1" fill="url(#accentGrad)" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.6;0.9" dur="2.5s" repeatCount="indefinite" />
                  </rect>
                  <rect x="18" y="42" width="4" height="4" rx="1" fill="#60a5fa" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.5;0.8" dur="2.5s" repeatCount="indefinite" />
                  </rect>

                  {/* Decorative line - glowing */}
                  <line x1="15" y1="28" x2="25" y2="28" stroke="#38bdf8" strokeWidth="0.5" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
                  </line>

                  {/* Additional accents - twinkling */}
                  <circle cx="20" cy="15" r="1" fill="#ffffff" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="r" values="1;1.2;1" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="20" cy="36" r="0.5" fill="#22d3ee" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>

              {/* Enhanced animated exhaust flame with multiple layers */}
              <div
                ref={exhaustRef}
                className="absolute -bottom-0.5 left-1/2 w-5 h-8 pointer-events-none"
                style={{
                  transform: 'translateX(-50%) translateY(22px)',
                }}
              >
                <div className="relative w-full h-full">
                  {/* Outer orange flame */}
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-red-500 to-transparent rounded-full blur-sm opacity-80 animate-flame"></div>

                  {/* Middle yellow flame */}
                  <div className="absolute inset-x-1 inset-y-0 bg-gradient-to-b from-yellow-300 via-orange-400 to-transparent rounded-full blur-[2px] opacity-70 animate-flame" style={{ animationDelay: '0.1s' }}></div>

                  {/* Inner white hot core */}
                  <div className="absolute inset-x-1.5 top-0 h-4 bg-gradient-to-b from-white via-yellow-200 to-transparent rounded-full blur-[1px] opacity-60 animate-flame-fast" style={{ animationDelay: '0.15s' }}></div>

                  {/* Flame sparks */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-200 rounded-full opacity-80 animate-spark"></div>
                  <div className="absolute bottom-1 left-1/3 w-0.5 h-0.5 bg-orange-300 rounded-full opacity-70 animate-spark" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute bottom-1 right-1/3 w-0.5 h-0.5 bg-red-400 rounded-full opacity-60 animate-spark" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>

            {/* Enhanced Tooltip with animation */}
            {showTooltip && !missed && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap animate-float">
                <div className="relative bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 px-4 py-2 rounded-full shadow-2xl border-2 border-white/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                  <span className="relative text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                    Catch me!
                    <Star className="w-3.5 h-3.5 animate-pulse" />
                  </span>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-cyan-600"></div>
                </div>
              </div>
            )}

            {/* Enhanced Miss Feedback */}
            {missed && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap animate-miss-bounce">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                  Missed! 💨
                </div>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Enhanced Speed Indicator */}
      {speedBoost && (
        <div className="fixed top-4 right-4 z-[100] animate-speed-enter">
          <div className="relative bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-4 py-2 rounded-full shadow-2xl border-2 border-white/30 animate-pulse-fast">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-shimmer"></div>
            <span className="relative text-white font-bold text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 animate-bounce" />
              SPEED BOOST!
              <Zap className="w-4 h-4 animate-bounce" style={{ animationDelay: '0.1s' }} />
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
        @keyframes flame {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.7; }
          50% { transform: scaleY(1.3) scaleX(0.9); opacity: 0.9; }
        }
        @keyframes flame-fast {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.6; }
          50% { transform: scaleY(1.5) scaleX(0.8); opacity: 0.8; }
        }
        @keyframes spark {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(8px) scale(0.3); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes star-burst {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
        }
        @keyframes miss-bounce {
          0%, 100% { transform: translate(-50%, 0); }
          25% { transform: translate(-50%, -10px); }
          50% { transform: translate(-50%, 0); }
          75% { transform: translate(-50%, -5px); }
        }
        @keyframes speed-enter {
          0% { opacity: 0; transform: scale(0.5) translateY(-20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse-fast {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-spin-slow { animation: spin-slow 6s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 8s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-flame { animation: flame 0.3s ease-in-out infinite; }
        .animate-flame-fast { animation: flame-fast 0.2s ease-in-out infinite; }
        .animate-spark { animation: spark 0.8s ease-out infinite; }
        .animate-float { animation: float 2s ease-in-out infinite; }
        .animate-star-burst { animation: star-burst 0.8s ease-out forwards; }
        .animate-miss-bounce { animation: miss-bounce 0.6s ease-out; }
        .animate-speed-enter { animation: speed-enter 0.4s ease-out; }
        .animate-pulse-fast { animation: pulse-fast 0.6s ease-in-out infinite; }
      `}</style>
    </>
  );
}
