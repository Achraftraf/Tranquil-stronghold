"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Rocket, Star, Gem, Zap, Play, X, Trophy, Heart, Shield, Flame } from 'lucide-react';

type GameItem = {
  id: number;
  x: number;
  y: number;
  speed: number;
};

type PowerUp = GameItem & {
  type: 'shield' | 'slowmo' | 'magnet';
};

type Bullet = {
  id: number;
  x: number;
  y: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
};

interface SpaceAdventureGameProps {
  handleClose?: () => void;
}

export default function SpaceAdventureGame({ handleClose }: SpaceAdventureGameProps) {
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(80);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [stars, setStars] = useState<GameItem[]>([]);
  const [obstacles, setObstacles] = useState<GameItem[]>([]);
  const [gems, setGems] = useState<GameItem[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [shield, setShield] = useState(false);
  const [slowMo, setSlowMo] = useState(false);
  const [magnet, setMagnet] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const keysPressed = useRef<Set<string>>(new Set());
  const touchPosition = useRef<{ x: number; y: number } | null>(null);
  const mousePosition = useRef<{ x: number; y: number } | null>(null);
  const isMouseActive = useRef<boolean>(false);
  const isTouchActive = useRef<boolean>(false);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const lastShootTime = useRef<number>(0);
  const autoShootInterval = useRef<NodeJS.Timeout | null>(null);

  const gameWidth = 100;
  const gameHeight = 100;
  const playerSize = 6;
  const moveSpeed = isMobile ? 2.5 : 1.7;
  const inputSmoothing = isMobile ? 0.15 : 0.2;
  const shootCooldown = isMobile ? 150 : 200;

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const createParticles = useCallback((x: number, y: number, color: string, count: number = 10) => {
    const particleCount = isMobile ? Math.floor(count * 0.6) : count;
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        color,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, [isMobile]);

  const shootBullet = useCallback(() => {
    const now = Date.now();
    if (now - lastShootTime.current < shootCooldown) return;
    
    lastShootTime.current = now;
    setBullets(prev => [...prev, {
      id: Math.random(),
      x: positionX + playerSize / 2 - 0.5,
      y: positionY - 2
    }]);
    createParticles(positionX + playerSize / 2, positionY, "#60a5fa", 5);
  }, [positionX, positionY, shootCooldown, createParticles]);

  const generateStar = useCallback(() => ({
    id: Math.random(),
    x: Math.random() * (gameWidth - 5),
    y: -5,
    speed: (1 + Math.random() * 0.5) * (slowMo ? 0.5 : 1),
  }), [slowMo]);

  const generateObstacle = useCallback(() => ({
    id: Math.random(),
    x: Math.random() * (gameWidth - 8),
    y: -5,
    speed: (1.5 + level * 0.2) * (slowMo ? 0.5 : 1),
  }), [level, slowMo]);

  const generateGem = useCallback(() => ({
    id: Math.random(),
    x: Math.random() * (gameWidth - 5),
    y: -5,
    speed: (1.2 + level * 0.1) * (slowMo ? 0.5 : 1),
  }), [level, slowMo]);

  const generatePowerUp = useCallback((): PowerUp => {
    const types: ('shield' | 'slowmo' | 'magnet')[] = ['shield', 'slowmo', 'magnet'];
    return {
      id: Math.random(),
      x: Math.random() * (gameWidth - 6),
      y: -5,
      speed: 1 * (slowMo ? 0.5 : 1),
      type: types[Math.floor(Math.random() * types.length)],
    };
  }, [slowMo]);

  // Touch controls
  useEffect(() => {
    if (!gameStarted || gameOver || !isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      isTouchActive.current = true;
      isMouseActive.current = false;
      
      if (autoShootInterval.current) clearInterval(autoShootInterval.current);
      autoShootInterval.current = setInterval(shootBullet, shootCooldown);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!gameAreaRef.current || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      const rect = gameAreaRef.current.getBoundingClientRect();
      const touchX = ((touch.clientX - rect.left) / rect.width) * 100;
      const touchY = ((touch.clientY - rect.top) / rect.height) * 100;
      
      touchPosition.current = { 
        x: Math.max(2, Math.min(gameWidth - playerSize - 2, touchX - playerSize / 2)), 
        y: Math.max(2, Math.min(gameHeight - playerSize - 2, touchY - playerSize / 2))
      };
    };

    const handleTouchEnd = () => {
      touchPosition.current = null;
      isTouchActive.current = false;
      if (autoShootInterval.current) {
        clearInterval(autoShootInterval.current);
        autoShootInterval.current = null;
      }
    };

    const gameArea = gameAreaRef.current;
    if (gameArea) {
      gameArea.addEventListener('touchstart', handleTouchStart, { passive: false });
      gameArea.addEventListener('touchmove', handleTouchMove, { passive: false });
      gameArea.addEventListener('touchend', handleTouchEnd);
      gameArea.addEventListener('touchcancel', handleTouchEnd);
      
      return () => {
        gameArea.removeEventListener('touchstart', handleTouchStart);
        gameArea.removeEventListener('touchmove', handleTouchMove);
        gameArea.removeEventListener('touchend', handleTouchEnd);
        gameArea.removeEventListener('touchcancel', handleTouchEnd);
        if (autoShootInterval.current) clearInterval(autoShootInterval.current);
      };
    }
  }, [gameStarted, gameOver, isMobile, shootBullet, shootCooldown]);

  // Keyboard controls
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["arrowleft", "arrowright", "arrowup", "arrowdown"].includes(key)) {
        e.preventDefault();
        keysPressed.current.add(key);
        isMouseActive.current = false;
        isTouchActive.current = false;
      }
      if (key === " " || key === "spacebar") {
        e.preventDefault();
        shootBullet();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStarted, gameOver, shootBullet]);

  // Mouse controls
  useEffect(() => {
    if (!gameStarted || gameOver || isMobile) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
      
      isMouseActive.current = true;
      isTouchActive.current = false;
      mousePosition.current = { 
        x: Math.max(2, Math.min(gameWidth - playerSize - 2, mouseX - playerSize / 2)), 
        y: Math.max(2, Math.min(gameHeight - playerSize - 2, mouseY - playerSize / 2))
      };
    };

    const onMouseLeave = () => {
      mousePosition.current = null;
      isMouseActive.current = false;
    };

    const onClick = () => {
      shootBullet();
    };

    const gameArea = gameAreaRef.current;
    if (gameArea) {
      gameArea.addEventListener("mousemove", onMouseMove);
      gameArea.addEventListener("mouseleave", onMouseLeave);
      gameArea.addEventListener("click", onClick);
      return () => {
        gameArea.removeEventListener("mousemove", onMouseMove);
        gameArea.removeEventListener("mouseleave", onMouseLeave);
        gameArea.removeEventListener("click", onClick);
      };
    }
  }, [gameStarted, gameOver, isMobile, shootBullet]);

  // Main game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setPositionX(prev => {
        if (!isTouchActive.current && !isMouseActive.current && keysPressed.current.size > 0) {
          let x = prev;
          if (keysPressed.current.has("arrowleft")) x = Math.max(2, prev - moveSpeed);
          if (keysPressed.current.has("arrowright")) x = Math.min(gameWidth - playerSize - 2, prev + moveSpeed);
          return x;
        }
        
        if (isTouchActive.current && touchPosition.current !== null) {
          return prev + (touchPosition.current.x - prev) * inputSmoothing;
        }
        
        if (isMouseActive.current && mousePosition.current !== null) {
          return prev + (mousePosition.current.x - prev) * inputSmoothing;
        }
        
        return prev;
      });

      setPositionY(prev => {
        if (!isTouchActive.current && !isMouseActive.current && keysPressed.current.size > 0) {
          let y = prev;
          if (keysPressed.current.has("arrowup")) y = Math.max(2, prev - moveSpeed);
          if (keysPressed.current.has("arrowdown")) y = Math.min(gameHeight - playerSize - 2, prev + moveSpeed);
          return y;
        }
        
        if (isTouchActive.current && touchPosition.current !== null) {
          return prev + (touchPosition.current.y - prev) * inputSmoothing;
        }
        
        if (isMouseActive.current && mousePosition.current !== null) {
          return prev + (mousePosition.current.y - prev) * inputSmoothing;
        }
        
        return prev;
      });

      setParticles(prev =>
        prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.02 }))
            .filter(p => p.life > 0)
      );

      setBullets(prev => prev
        .map(b => ({ ...b, y: b.y - 3 }))
        .filter(b => b.y > -5)
      );

      setStars(prev => {
        const updated = prev.map(s => ({ ...s, y: s.y + s.speed })).filter(s => s.y < 105);
        if (Math.random() < 0.3) updated.push(generateStar());
        return updated;
      });

      setObstacles(prev => {
        const updated = prev.map(o => ({ ...o, y: o.y + o.speed })).filter(o => o.y < 105);
        if (Math.random() < 0.015 + level * 0.008) updated.push(generateObstacle());
        return updated;
      });

      setGems(prev => {
        const updated = prev.map(g => ({ ...g, y: g.y + g.speed })).filter(g => g.y < 105);
        if (Math.random() < 0.03) updated.push(generateGem());
        return updated;
      });

      setPowerUps(prev => {
        const updated = prev.map(p => ({ ...p, y: p.y + p.speed })).filter(p => p.y < 105);
        if (Math.random() < 0.005) updated.push(generatePowerUp());
        return updated;
      });

      setGems(prev => prev.filter(g => {
        const magnetRange = magnet ? 12 : 0;
        const hit = Math.abs(g.x - positionX) < playerSize + magnetRange &&
                    Math.abs(g.y - positionY) < playerSize + magnetRange;

        if (hit) {
          setScore(s => s + 10 * (1 + combo));
          setCombo(c => c + 1);
          createParticles(g.x, g.y, "#3b82f6", 8);
        }
        return !hit;
      }));

      setPowerUps(prev => prev.filter(p => {
        const hit = Math.abs(p.x - positionX) < playerSize + 3 &&
                    Math.abs(p.y - positionY) < playerSize + 3;

        if (hit) {
          createParticles(p.x, p.y, "#8b5cf6", 12);
          if (p.type === "shield") setShield(true), setTimeout(() => setShield(false), 5000);
          if (p.type === "slowmo") setSlowMo(true), setTimeout(() => setSlowMo(false), 3000);
          if (p.type === "magnet") setMagnet(true), setTimeout(() => setMagnet(false), 4000);
        }

        return !hit;
      }));

      setObstacles(prev => {
        let hit = false;
        let destroyedIds = new Set<number>();

        bullets.forEach(bullet => {
          prev.forEach(o => {
            const bulletHit = Math.abs(bullet.x - o.x) < 4 && Math.abs(bullet.y - o.y) < 4;
            if (bulletHit && !destroyedIds.has(o.id)) {
              destroyedIds.add(o.id);
              createParticles(o.x, o.y, "#fbbf24", 20);
              setScore(s => s + 50);
              setBullets(b => b.filter(bul => bul.id !== bullet.id));
            }
          });
        });

        prev.forEach(o => {
          const c = Math.abs(o.x - positionX) < playerSize + 2 &&
                    Math.abs(o.y - positionY) < playerSize + 2;

          if (c && !hit && !destroyedIds.has(o.id)) {
            hit = true;
            destroyedIds.add(o.id);
            setCombo(0);
            createParticles(o.x, o.y, "#ef4444", 15);

            if (shield) {
              setShield(false);
            } else {
              setLives(l => {
                const nl = l - 1;
                if (nl <= 0) {
                  setGameOver(true);
                  if (score > highScore) setHighScore(score);
                }
                return nl;
              });

              setShakeScreen(true);
              setTimeout(() => setShakeScreen(false), 200);
            }
          }
        });

        return prev.filter(o => !destroyedIds.has(o.id));
      });

      setScore(prev => {
        const n = prev + 1;
        if (n % 1000 === 0) setLevel(l => l + 1);
        return n;
      });

    }, 30);

    return () => clearInterval(interval);
  }, [
    gameStarted, gameOver, positionX, positionY, level, combo,
    shield, magnet, slowMo, score, highScore, bullets, isMobile,
    moveSpeed, inputSmoothing, createParticles,
    generateStar, generateObstacle, generateGem, generatePowerUp
  ]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPositionX(50);
    setPositionY(80);
    setStars([]);
    setObstacles([]);
    setGems([]);
    setPowerUps([]);
    setBullets([]);
    setParticles([]);
    setLevel(1);
    setLives(3);
    setCombo(0);
    setShield(false);
    setSlowMo(false);
    setMagnet(false);
    keysPressed.current.clear();
    mousePosition.current = null;
    touchPosition.current = null;
    isMouseActive.current = false;
    isTouchActive.current = false;
  };

  return (
    <div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-2 sm:p-4 select-none"
  style={{
    paddingTop: '70px',
  }}
>
      <div className="w-full max-w-5xl h-[90vh] sm:h-[85vh] bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              <span className="hidden sm:inline">Space Adventure</span>
              <span className="sm:hidden">Space</span>
            </h2>
          </div>
          {handleClose && (
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-3 bg-gray-50 border-b border-gray-200 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
            <span className="text-gray-900 font-bold">{score}</span>
          </div>
          <div className="text-gray-600">
            Best: <span className="text-blue-600 font-semibold">{highScore}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600">Level</span>
            <span className="text-purple-600 font-bold">{level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
            <div className="flex gap-0.5 ml-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-all ${
                    i < lives ? 'text-red-500 fill-red-500 animate-heartbeat' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
            <span className="text-gray-600">Combo</span>
            <span className="text-orange-600 font-bold">x{combo}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-gray-600 text-xs hidden sm:inline">Power-Ups:</span>
            <div className="flex gap-1">
              {shield && <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 fill-blue-500 animate-bounce" />}
              {slowMo && <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 animate-bounce" />}
              {magnet && <Gem className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 animate-bounce" />}
              {!shield && !slowMo && !magnet && (
                <span className="text-gray-400 text-xs">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-purple-50">
          {!gameStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="relative mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                <Rocket className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 relative animate-bounce" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to Play?</h3>
              <div className="text-center text-gray-700 mb-6 sm:mb-8 space-y-2 text-xs sm:text-sm max-w-md px-4">
                {isMobile ? (
                  <>
                    <p>
                      <span className="text-blue-600 font-semibold">👆 Touch & drag</span> to move
                    </p>
                    <p className="text-gray-600">
                      <span className="text-orange-600 font-semibold">Auto-shoots</span> while touching
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Control your ship using <span className="text-blue-600 font-semibold">🖱 Mouse</span>{' '}
                      <span className="text-gray-500">or</span>{' '}
                      <span className="text-purple-600 font-semibold">⬆ ⬇ ⬅ ➡ Arrow Keys</span>
                    </p>
                    <p className="text-gray-600">
                      <span className="text-orange-600 font-semibold">Click</span> or{' '}
                      <span className="text-orange-600 font-semibold">Spacebar</span> to Shoot
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={startGame}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                Start Game
              </button>
            </div>
          ) : (
            <div
              ref={gameAreaRef}
              className={`relative w-full h-full bg-gradient-to-b from-blue-50 via-white to-purple-50 cursor-crosshair ${
                shakeScreen ? 'animate-shake' : ''
              }`}
              style={{ userSelect: 'none', touchAction: 'none' }}
            >
              {/* Particles */}
              {particles.map(p => (
                <div
                  key={p.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: isMobile ? "6px" : "8px",
                    height: isMobile ? "6px" : "8px",
                    backgroundColor: p.color,
                    opacity: p.life * 0.8,
                    boxShadow: `0 0 ${isMobile ? '12px' : '16px'} ${p.color}`,
                  }}
                />
              ))}

              {/* Stars */}
              {stars.map(s => (
                <Star
                  key={s.id}
                  className="absolute text-gray-400 fill-gray-400 animate-twinkle pointer-events-none"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: isMobile ? "10px" : "12px",
                    height: isMobile ? "10px" : "12px",
                  }}
                />
              ))}

              {/* Gems */}
              {gems.map(g => (
                <Gem
                  key={g.id}
                  className="absolute text-blue-500 animate-pulse pointer-events-none"
                  style={{
                    left: `${g.x}%`,
                    top: `${g.y}%`,
                    width: isMobile ? "20px" : "24px",
                    height: isMobile ? "20px" : "24px",
                    filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))',
                  }}
                />
              ))}

              {/* Bullets */}
              {bullets.map(b => (
                <div
                  key={b.id}
                  className="absolute bg-blue-400 rounded-full pointer-events-none shadow-lg"
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: isMobile ? "6px" : "8px",
                    height: isMobile ? "14px" : "18px",
                    boxShadow: '0 0 12px rgba(96, 165, 250, 0.8)',
                  }}
                />
              ))}

              {/* Power-ups */}
              {powerUps.map(p => (
                <div
                  key={p.id}
                  className="absolute rounded-full flex items-center justify-center animate-pulse pointer-events-none"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: isMobile ? "24px" : "28px",
                    height: isMobile ? "24px" : "28px",
                  }}
                >
                  {p.type === "shield" && (
                    <Shield className="w-full h-full text-blue-500" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' }} />
                  )}
                  {p.type === "slowmo" && (
                    <Zap className="w-full h-full text-yellow-500" style={{ filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.6))' }} />
                  )}
                  {p.type === "magnet" && (
                    <Gem className="w-full h-full text-green-500" style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))' }} />
                  )}
                </div>
              ))}

              {/* Obstacles */}
              {obstacles.map(o => (
                <Flame
                  key={o.id}
                  className="absolute text-red-500 animate-pulse pointer-events-none"
                  style={{
                    left: `${o.x}%`,
                    top: `${o.y}%`,
                    width: isMobile ? "28px" : "32px",
                    height: isMobile ? "28px" : "32px",
                    filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))',
                  }}
                />
              ))}

              {/* Player */}
              <div
                className="absolute transition-all duration-75 pointer-events-none"
                style={{
                  left: `${positionX}%`,
                  top: `${positionY}%`,
                  width: isMobile ? "48px" : "52px",
                  height: isMobile ? "48px" : "52px",
                }}
              >
                {shield && (
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-60"
                    style={{ 
                      width: isMobile ? "60px" : "70px", 
                      height: isMobile ? "60px" : "70px",
                      left: isMobile ? "-6px" : "-9px",
                      top: isMobile ? "-6px" : "-9px"
                    }}
                  />
                )}
                <Rocket 
                  className="w-full h-full text-blue-600 drop-shadow-lg transform rotate-0" 
                  style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))' }}
                />
              </div>

              {/* Game Over Overlay */}
              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm mx-4 text-center shadow-2xl">
                    <div className="relative mb-4 sm:mb-6">
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl animate-pulse"></div>
                      <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-500 mx-auto relative" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Game Over</h3>
                    <div className="space-y-2 mb-4 sm:mb-6">
                      <p className="text-gray-700">
                        Score: <span className="text-blue-600 font-bold text-xl sm:text-2xl">{score}</span>
                      </p>
                      <p className="text-gray-700">
                        Level: <span className="text-purple-600 font-bold text-lg">{level}</span>
                      </p>
                      {score === highScore && score > 0 && (
                        <div className="mt-3 sm:mt-4 p-3 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                          <p className="text-yellow-700 font-bold text-sm sm:text-base">🏆 NEW HIGH SCORE! 🏆</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={startGame}
                      className="w-full px-6 py-3 sm:py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base sm:text-lg hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      Play Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls Help */}
        {gameStarted && !gameOver && (
          <div className="px-3 sm:px-6 py-2 sm:py-3 bg-gray-50 border-t border-gray-200 text-center text-[10px] sm:text-xs text-gray-600">
            {isMobile ? (
              <>Touch & drag to move • Auto-shoots while touching</>
            ) : (
              <>
                Use <span className="text-purple-600 font-semibold">Arrow Keys</span>{' '}
                <span className="text-gray-400">or</span>{' '}
                <span className="text-blue-600 font-semibold">Mouse</span> to control{' '}
                <span className="text-gray-400">•</span>{' '}
                <span className="text-orange-600 font-semibold">Spacebar/Click</span> to shoot
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out;
        }
        .animate-heartbeat {
          animation: heartbeat 1s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}