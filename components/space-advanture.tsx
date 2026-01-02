"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Rocket, Star, X, Heart, Flame } from 'lucide-react';

type GameItem = { id: number; x: number; y: number; speed: number; size: number; };
type Bullet = { id: number; x: number; y: number; };
type Particle = { id: number; x: number; y: number; vx: number; vy: number; life: number; color: string; size: number; };

export default function SpaceAdventureGame({ handleClose, rocketPosition }: { handleClose?: () => void; rocketPosition?: { x: number; y: number } }) {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const [shake, setShake] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(true);

  const player = useRef({ x: 50, y: 80, targetX: 50, targetY: 80, rot: 0 });
  const entities = useRef({
    stars: [] as GameItem[],
    hazards: [] as GameItem[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    lastTime: 0
  });

  const requestRef = useRef<number | undefined>(undefined);
  const gameArea = useRef<HTMLDivElement>(null);
  const keys = useRef<Set<string>>(new Set());
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpening(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const createFX = (x: number, y: number, color: string, n = 12) => {
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      entities.current.particles.push({
        id: Math.random(), x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0, color,
        size: 2 + Math.random() * 3
      });
    }
  };

  const update = useCallback((time: number) => {
    const dt = entities.current.lastTime ? (time - entities.current.lastTime) / 16.67 : 1;
    entities.current.lastTime = time;

    const moveSpeed = 1.3;
    if (keys.current.has("arrowleft") || keys.current.has("a")) player.current.targetX -= moveSpeed * dt;
    if (keys.current.has("arrowright") || keys.current.has("d")) player.current.targetX += moveSpeed * dt;
    if (keys.current.has("arrowup") || keys.current.has("w")) player.current.targetY -= moveSpeed * dt;
    if (keys.current.has("arrowdown") || keys.current.has("s")) player.current.targetY += moveSpeed * dt;

    player.current.targetX = Math.max(10, Math.min(90, player.current.targetX));
    player.current.targetY = Math.max(15, Math.min(85, player.current.targetY));

    const prevX = player.current.x;
    player.current.x += (player.current.targetX - player.current.x) * 0.15 * dt;
    player.current.y += (player.current.targetY - player.current.y) * 0.15 * dt;
    player.current.rot = (player.current.x - prevX) * 20;

    const state = entities.current;
    state.stars.forEach(s => s.y += s.speed * dt);
    state.hazards.forEach(h => h.y += h.speed * dt);
    state.bullets.forEach(b => b.y -= 5 * dt);
    state.particles.forEach(p => {
      p.x += p.vx * 0.2 * dt;
      p.y += p.vy * 0.2 * dt;
      p.life -= 0.02 * dt;
    });

    if (Math.random() < 0.2) state.stars.push({ id: Math.random(), x: Math.random() * 100, y: -5, speed: 0.5 + Math.random() * 2, size: 1 });
    if (Math.random() < 0.02) state.hazards.push({ id: Math.random(), x: Math.random() * 100, y: -5, speed: 0.8 + Math.random(), size: 24 });

    state.hazards = state.hazards.filter(h => {
      if (Math.hypot(player.current.x - h.x, player.current.y - h.y) < 7) {
        setLives(l => { if (l <= 1) setGameOver(true); return l - 1; });
        setShake(true); setTimeout(() => setShake(false), 150);
        createFX(h.x, h.y, "#ff4d4d");
        return false;
      }
      return h.y < 110;
    });

    state.bullets = state.bullets.filter(b => {
      let hit = false;
      state.hazards = state.hazards.filter(h => {
        if (Math.hypot(b.x - h.x, b.y - h.y) < 6) {
          hit = true;
          setScore(s => s + 50);
          createFX(h.x, h.y, "#fbbf24");
          return false;
        }
        return true;
      });
      return !hit && b.y > -5;
    });

    state.stars = state.stars.filter(s => s.y < 110);
    state.particles = state.particles.filter(p => p.life > 0);

    setTick(t => t + 1);
    requestRef.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver && !isOpening) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameStarted, gameOver, isOpening, update]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  const handleCloseClick = () => {
    setIsClosing(true);
    setTimeout(() => handleClose?.(), 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden perspective-[1200px]">
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-50/95 via-cyan-50/95 to-sky-100/95 backdrop-blur-xl transition-opacity duration-700 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleCloseClick}
      />

      <div
        ref={gameArea}
        onMouseMove={(e) => {
          const rect = gameArea.current?.getBoundingClientRect();
          if (rect) {
            player.current.targetX = ((e.clientX - rect.left) / rect.width) * 100;
            player.current.targetY = ((e.clientY - rect.top) / rect.height) * 100;
          }
        }}
        onClick={() => gameStarted && !gameOver && entities.current.bullets.push({ id: Math.random(), x: player.current.x, y: player.current.y - 5 })}
        className={`
          relative w-full max-w-2xl h-[80vh] max-h-[700px]
          bg-gradient-to-b from-sky-100 via-blue-50 to-cyan-100 rounded-[3.5rem] border-2 border-blue-200/50 overflow-hidden
          shadow-[0_20px_60px_rgba(59,130,246,0.3)]
          ${shake ? 'animate-shake' : ''}
          ${isClosing ? 'animate-genie-close' : isOpening ? 'animate-genie-open' : ''}
        `}
      >
        {/* Parallax Starfield - Light Theme */}
        {entities.current.stars.map(s => (
          <div key={s.id} className="absolute bg-blue-300 rounded-full" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, opacity: s.speed / 4 }} />
        ))}

        {/* HUD - Enhanced Light Theme */}
        <div className="absolute top-10 inset-x-10 flex justify-between items-center z-50 pointer-events-none">
          <div className="px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-blue-200 shadow-lg">
            <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest block">Score</span>
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent italic">{score.toLocaleString()}</span>
          </div>
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} size={22} className={`${i < lives ? 'text-rose-500 fill-rose-500 drop-shadow-lg' : 'text-gray-300'} transition-all duration-500`} />
            ))}
          </div>
        </div>

        {/* Particles & Hazards - Enhanced */}
        {entities.current.particles.map(p => (
          <div key={p.id} className="absolute rounded-full shadow-lg" style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, backgroundColor: p.color, opacity: p.life, filter: 'blur(0.5px)' }} />
        ))}
        {entities.current.hazards.map(h => (
          <Flame key={h.id} size={h.size} className="absolute text-orange-400 animate-pulse drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%,-50%)' }} />
        ))}
        {entities.current.bullets.map(b => (
          <div key={b.id} className="absolute bg-gradient-to-t from-blue-500 to-cyan-400 w-1.5 h-7 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translateX(-50%)' }} />
        ))}

        {/* Player Vessel */}
        {gameStarted && !gameOver && (
          <div
            className="absolute transition-transform duration-75 pointer-events-none"
            style={{ left: `${player.current.x}%`, top: `${player.current.y}%`, transform: `translate(-50%, -50%) rotate(${player.current.rot}deg)` }}
          >
            {/* Engine FX */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-12 bg-gradient-to-b from-blue-400 via-cyan-300 to-transparent blur-sm animate-engine" />

            <svg width="28" height="48" viewBox="0 0 40 60" className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              <path d="M20 0C10 15 5 35 5 50H35C35 35 30 15 20 0Z" fill="#3b82f6" />
              <path d="M20 5C14 20 10 35 10 45H30C30 35 26 20 20 5Z" fill="#60a5fa" />
              <circle cx="20" cy="25" r="4" fill="#22d3ee" />
              <path d="M5 35L0 55L5 50Z" fill="#06b6d4" />
              <path d="M35 35L40 55L35 50Z" fill="#06b6d4" />
            </svg>
          </div>
        )}

        {/* Menus - Light Theme */}
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-[60] bg-white/90 backdrop-blur-2xl">
            <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent italic tracking-tighter mb-4">{gameOver ? "Mission Complete" : "Space Adventure"}</h1>
            <p className="text-blue-400 text-sm mb-8 tracking-widest uppercase">{gameOver ? `Final Score: ${score.toLocaleString()}` : "Ready for Launch"}</p>
            <button
              onClick={() => { setScore(0); setLives(3); setGameOver(false); setGameStarted(true); }}
              className="px-14 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black rounded-full hover:scale-105 hover:shadow-2xl transition-all shadow-lg"
            >
              {gameOver ? "PLAY AGAIN" : "START GAME"}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        /* THE PRO GENIE EFFECT */
        @keyframes genie-open {
          0% {
            opacity: 0;
            transform: translate3d(0, 45%, -600px) scale(0.1, 0.05);
            filter: brightness(2) blur(15px);
            border-radius: 100%;
          }
          40% {
            opacity: 1;
            transform: translate3d(0, 10%, -200px) scale(0.6, 1.2);
            filter: brightness(1.3) blur(4px);
          }
          70% {
            transform: translate3d(0, -5%, 0) scale(1.05, 0.9);
            filter: brightness(1.1) blur(1px);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1, 1);
            filter: brightness(1) blur(0px);
            border-radius: 3.5rem;
          }
        }

        @keyframes genie-close {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1, 1);
            filter: brightness(1) blur(0px);
          }
          30% {
            transform: translate3d(0, -10%, 0) scale(1.1, 0.8);
            filter: brightness(1.2) blur(1px);
          }
          100% {
            opacity: 0;
            transform: translate3d(0, 50%, -800px) scale(0.05, 0.01);
            filter: brightness(4) blur(20px);
          }
        }

        .animate-genie-open { 
            animation: genie-open 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            transform-origin: center bottom;
        }
        .animate-genie-close { 
            animation: genie-close 0.75s cubic-bezier(0.7, 0, 0.84, 0) forwards;
            transform-origin: center bottom;
        }

        @keyframes shake {
          0%, 100% { transform: translate(0,0); }
          25% { transform: translate(-5px, 3px); }
          75% { transform: translate(5px, -3px); }
        }
        @keyframes engine {
          0%, 100% { height: 10px; opacity: 0.6; }
          50% { height: 16px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}