"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Rocket, Star, X, Trophy, Heart, Flame, Shield, Zap } from 'lucide-react';

// --- Types ---
type GameItem = { id: number; x: number; y: number; speed: number; size: number; };
type Bullet = { id: number; x: number; y: number; };
type Particle = { id: number; x: number; y: number; vx: number; vy: number; life: number; color: string; };

export default function SpaceAdventureGame({ handleClose }: { handleClose?: () => void }) {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const [shake, setShake] = useState(false);

  // High-Performance Game State (Mutable Refs)
  const player = useRef({ x: 50, y: 80, targetX: 50, targetY: 80, rot: 0 });
  const entities = useRef({
    stars: [] as GameItem[],
    hazards: [] as GameItem[],
    gems: [] as GameItem[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    lastTime: 0
  });

  const requestRef = useRef<number | undefined>(undefined);
  const gameArea = useRef<HTMLDivElement>(null);
  const keys = useRef<Set<string>>(new Set());
  const [, setTick] = useState(0);

 const spawn = (type: 'stars' | 'hazards' | 'gems', count = 1) => {
    for(let i=0; i<count; i++) {
      entities.current[type].push({
        id: Math.random(),
        x: Math.random() * 100,
        y: -10,
        speed: type === 'hazards' ? 0.3 + Math.random() * 0.3 : 0.2 + Math.random() * 0.5,
        size: type === 'hazards' ? 25 : 15
      });
    }
  };
  
  const createFX = (x: number, y: number, color: string, n = 8) => {
    for (let i = 0; i < n; i++) {
      entities.current.particles.push({
        id: Math.random(), x, y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 1.0, color
      });
    }
  };

  const update = useCallback((time: number) => {
    const dt = time - entities.current.lastTime;
    entities.current.lastTime = time;

    // Smooth Input Interpolation
    const speed = 0.02;
    if (keys.current.has("arrowleft") || keys.current.has("a")) player.current.targetX -= speed * dt;
    if (keys.current.has("arrowright") || keys.current.has("d")) player.current.targetX += speed * dt;
    if (keys.current.has("arrowup") || keys.current.has("w")) player.current.targetY -= speed * dt;
    if (keys.current.has("arrowdown") || keys.current.has("s")) player.current.targetY += speed * dt;

    player.current.targetX = Math.max(5, Math.min(95, player.current.targetX));
    player.current.targetY = Math.max(10, Math.min(90, player.current.targetY));

    const prevX = player.current.x;
    player.current.x += (player.current.targetX - player.current.x) * 0.15;
    player.current.y += (player.current.targetY - player.current.y) * 0.15;
    player.current.rot = (player.current.x - prevX) * 20;

    // Entity Processing
    const state = entities.current;
    state.stars.forEach(s => s.y += s.speed);
    state.hazards.forEach(h => h.y += h.speed);
    state.gems.forEach(g => g.y += g.speed);
    state.bullets.forEach(b => b.y -= 4);
    state.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.04; });

    // Spawning Rates
    if (Math.random() < 0.2) spawn('stars');
    if (Math.random() < 0.03) spawn('hazards');
    if (Math.random() < 0.01) spawn('gems');

    // Collision Detection (Circle-to-Circle)
    state.hazards = state.hazards.filter(h => {
      const d = Math.hypot(player.current.x - h.x, player.current.y - h.y);
      if (d < 6) {
        setLives(l => { if (l <= 1) setGameOver(true); return l - 1; });
        setShake(true); setTimeout(() => setShake(false), 150);
        createFX(h.x, h.y, "#ef4444", 15);
        return false;
      }
      return h.y < 110;
    });

    state.gems = state.gems.filter(g => {
      if (Math.hypot(player.current.x - g.x, player.current.y - g.y) < 6) {
        setScore(s => s + 100);
        createFX(g.x, g.y, "#fbbf24", 10);
        return false;
      }
      return g.y < 110;
    });

    state.bullets = state.bullets.filter(b => {
      let hit = false;
      state.hazards = state.hazards.filter(h => {
        if (Math.hypot(b.x - h.x, b.y - h.y) < 5) {
          hit = true;
          setScore(s => s + 50);
          createFX(h.x, h.y, "#f97316", 8);
          return false;
        }
        return true;
      });
      return !hit && b.y > -5;
    });

    // Cleanup
    state.particles = state.particles.filter(p => p.life > 0);
    state.stars = state.stars.filter(s => s.y < 110);

    setTick(t => t + 1);
    requestRef.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameStarted, gameOver, update]);

  // --- Handlers ---
  const handleMove = (e: any) => {
    if (!gameArea.current) return;
    const rect = gameArea.current.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    player.current.targetX = ((x - rect.left) / rect.width) * 100;
    player.current.targetY = ((y - rect.top) / rect.height) * 100;
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  const shoot = () => {
    entities.current.bullets.push({ id: Math.random(), x: player.current.x, y: player.current.y - 4 });
  };

  return (
<div
  className="fixed left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/90 p-4
             top-[150px] sm:top-[100px] md:top-[80px]"
  > <div 
        ref={gameArea}
        onMouseMove={handleMove}
        onClick={shoot}
        className={`relative w-full max-w-2xl h-[80vh] bg-[#05070a] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl transition-all ${shake ? 'animate-shake' : ''}`}
        style={{ touchAction: 'none' }}
      >
        {/* HUD */}
        <div className="absolute top-6 inset-x-8 flex justify-between items-start z-40 pointer-events-none">
          <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Score</p>
            <p className="text-xl font-black text-white italic">{score.toLocaleString()}</p>
          </div>
          
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`p-2 rounded-xl backdrop-blur-md border border-white/10 ${i < lives ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-white/10'}`}>
                <Heart size={18} fill={i < lives ? "currentColor" : "none"} />
              </div>
            ))}
            {handleClose && (
              <button onClick={handleClose} className="p-2 bg-white/5 backdrop-blur-md rounded-xl text-white/50 hover:bg-white/10 pointer-events-auto">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Entities */}
        <div className="absolute inset-0">
          {entities.current.stars.map(s => (
            <div key={s.id} className="absolute bg-white rounded-full opacity-30" style={{ left: `${s.x}%`, top: `${s.y}%`, width: '2px', height: '2px' }} />
          ))}
          {entities.current.particles.map(p => (
            <div key={p.id} className="absolute rounded-full" style={{ left: `${p.x}%`, top: `${p.y}%`, width: '3px', height: '3px', backgroundColor: p.color, opacity: p.life }} />
          ))}
          {entities.current.hazards.map(h => (
            <Flame key={h.id} className="absolute text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" style={{ left: `${h.x}%`, top: `${h.y}%`, width: h.size, height: h.size }} />
          ))}
          {entities.current.gems.map(g => (
            <Star key={g.id} className="absolute text-yellow-400 fill-yellow-400 animate-pulse" style={{ left: `${g.x}%`, top: `${g.y}%`, width: g.size, height: g.size }} />
          ))}
          {entities.current.bullets.map(b => (
            <div key={b.id} className="absolute bg-blue-400 w-1 h-5 rounded-full shadow-[0_0_10px_#60a5fa]" style={{ left: `${b.x}%`, top: `${b.y}%` }} />
          ))}
        </div>

        {/* Player Rocket */}
        {gameStarted && !gameOver && (
          <div 
            className="absolute transition-transform duration-75 pointer-events-none"
            style={{ left: `${player.current.x}%`, top: `${player.current.y}%`, transform: `translate(-50%, -50%) rotate(${player.current.rot}deg)` }}
          >
            {/* Engine FX */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-12 bg-gradient-to-b from-orange-500 to-transparent blur-sm animate-engine" />
            
            <svg width="23" height="40" viewBox="0 0 40 60">
              <path d="M20 0C10 15 5 35 5 50H35C35 35 30 15 20 0Z" fill="#fff" />
              <path d="M20 5C14 20 10 35 10 45H30C30 35 26 20 20 5Z" fill="#e2e8f0" />
              <circle cx="20" cy="25" r="4" fill="#38bdf8" />
              <path d="M5 35L0 55L5 50Z" fill="#ef4444" />
              <path d="M35 35L40 55L35 50Z" fill="#ef4444" />
            </svg>
          </div>
        )}

        {/* UI Screens */}
        {!gameStarted || gameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05070a]/80 backdrop-blur-sm z-50 p-12 text-center">
            {gameOver && <Trophy className="w-20 h-20 text-yellow-500 mb-4 drop-shadow-2xl" />}
            <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">
              {gameOver ? "MISSION COMPLETE" : "SPACE ADVENTURE"}
            </h1>
            <p className="text-white/40 text-sm mb-8 tracking-widest uppercase">
              {gameOver ? `Final Score: ${score.toLocaleString()}` : "Navigator System Online"}
            </p>
            <button 
              onClick={() => { setScore(0); setLives(3); setGameOver(false); setGameStarted(true); }}
              className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter"
            >
              {gameOver ? "Reboot Mission" : "Launch Vessel"}
            </button>
          </div>
        ) : null}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0,0); }
          25% { transform: translate(-2px, 2px); }
          75% { transform: translate(2px, -2px); }
        }
        @keyframes engine {
          0%, 100% { height: 10px; opacity: 0.5; }
          50% { height: 25px; opacity: 1; }
        }
        .animate-shake { animation: shake 0.1s infinite; }
        .animate-engine { animation: engine 0.05s infinite; }
      `}</style>
    </div>
  );
}