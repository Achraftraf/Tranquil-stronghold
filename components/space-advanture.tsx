"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Rocket, Star, X, Heart, Flame } from 'lucide-react';

type GameItem = { id: number; x: number; y: number; speed: number; size: number; };
type Bullet = { id: number; x: number; y: number; };
type Particle = { id: number; x: number; y: number; vx: number; vy: number; life: number; color: string; size: number; };

export default function SpaceAdventureGame({ handleClose }: { handleClose?: () => void }) {
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
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-700 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
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
          bg-[#05070a] rounded-[3.5rem] border border-white/10 overflow-hidden
          shadow-[0_50px_100px_rgba(0,0,0,0.8)]
          ${shake ? 'animate-shake' : ''}
          ${isClosing ? 'animate-genie-close' : isOpening ? 'animate-genie-open' : ''}
        `}
      >
        {/* Parallax Starfield */}
        {entities.current.stars.map(s => (
          <div key={s.id} className="absolute bg-white rounded-full" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, opacity: s.speed / 2.5 }} />
        ))}

        {/* HUD */}
        <div className="absolute top-10 inset-x-10 flex justify-between items-center z-50 pointer-events-none">
          <div className="px-6 py-2 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10">
            <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest block">Telemetry</span>
            <span className="text-2xl font-black text-white italic">{score.toLocaleString()}</span>
          </div>
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} size={22} className={`${i < lives ? 'text-red-500 fill-red-500' : 'text-white/10'} transition-all duration-500`} />
            ))}
          </div>
        </div>

        {/* Particles & Hazards */}
        {entities.current.particles.map(p => (
          <div key={p.id} className="absolute rounded-full" style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, backgroundColor: p.color, opacity: p.life }} />
        ))}
        {entities.current.hazards.map(h => (
          <Flame key={h.id} size={h.size} className="absolute text-orange-500 animate-pulse" style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%,-50%)' }} />
        ))}
        {entities.current.bullets.map(b => (
          <div key={b.id} className="absolute bg-cyan-400 w-1 h-6 rounded-full shadow-[0_0_12px_#22d3ee]" style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translateX(-50%)' }} />
        ))}

        {/* Player Vessel */}
        {gameStarted && !gameOver && (
          <div 
            className="absolute transition-transform duration-75 pointer-events-none"
            style={{ left: `${player.current.x}%`, top: `${player.current.y}%`, transform: `translate(-50%, -50%) rotate(${player.current.rot}deg)` }}
          >
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3 h-12 bg-blue-500/40 blur-lg animate-pulse" />
            <Rocket size={40} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
          </div>
        )}

        {/* Menus */}
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-[60] bg-black/40 backdrop-blur-xl">
            <h1 className="text-6xl font-black text-white italic tracking-tighter mb-8">{gameOver ? "Vessel Lost" : "Void Runner"}</h1>
            <button 
                onClick={() => { setScore(0); setLives(3); setGameOver(false); setGameStarted(true); }}
                className="px-14 py-5 bg-white text-black font-black rounded-full hover:scale-105 transition-transform shadow-2xl"
            >
                {gameOver ? "REBOOT" : "LAUNCH"}
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
      `}</style>
    </div>
  );
}