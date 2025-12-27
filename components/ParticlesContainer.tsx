"use client";

import React, { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, Container } from "@tsparticles/engine";

interface ParticlesContainerProps {
  style?: React.CSSProperties;
  className?: string;
  showLoadingIndicator?: boolean;
  particleColor?: string;
  linkColor?: string;
  particleCount?: number;
  interactiveMode?: "grab" | "repulse" | "bubble";
}

const ParticlesContainer: React.FC<ParticlesContainerProps> = ({
  style,
  className = "",
  showLoadingIndicator = true,
  particleColor = "#3b82f6",
  linkColor = "#60a5fa",
  particleCount = 80,
  interactiveMode = "grab",
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initParticles = async () => {
      try {
        await initParticlesEngine(async (engine: Engine) => {
          await loadSlim(engine);
        });
        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to initialize particles:", err);
        setError("Failed to load particle effects");
      }
    };

    initParticles();
  }, []);

  const particlesLoaded = useCallback(async (container?: Container) => {
    if (container) {
      console.log("Particles container loaded successfully");
    }
  }, []);

  // Error state
  if (error) {
    return null;
  }

  // Loading state
  if (!isInitialized) {
    return showLoadingIndicator ? (
      <div 
        className={`fixed inset-0 pointer-events-none ${className}`}
        style={{ ...style, zIndex: style?.zIndex ?? 1 }}
      >
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1.5 text-xs rounded shadow-lg z-50 pointer-events-auto animate-pulse">
          Loading particles...
        </div>
      </div>
    ) : null;
  }

  return (
    <div 
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ ...style, zIndex: style?.zIndex ?? 1 }}
    >
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        className="w-full h-full"
        options={{
          fullScreen: { 
            enable: false,
            zIndex: 0 
          },
          background: {
            color: { value: "transparent" },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { 
                enable: true, 
                mode: interactiveMode
              },
              onClick: {
                enable: false,
                mode: "push"
              },
              resize: { enable: true },
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.8,
                },
              },
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
              bubble: {
                distance: 200,
                size: 8,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: { 
              value: particleColor 
            },
            links: {
              color: linkColor,
              distance: 150,
              enable: true,
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
              random: false,
              straight: false,
              outModes: { 
                default: "out" 
              },
            },
            number: {
              value: particleCount,
              density: { 
                enable: true,
                width: 1920,
                height: 1080
              },
            },
            opacity: { 
              value: 0.5,
            },
            shape: { 
              type: "circle" 
            },
            size: { 
              value: { min: 1, max: 5 }
            },
          },
          detectRetina: true,
          responsive: [
            {
              maxWidth: 768,
              options: {
                particles: {
                  number: {
                    value: Math.floor(particleCount * 0.5),
                    density: {
                      enable: true,
                      width: 768,
                      height: 1024
                    }
                  },
                  links: {
                    distance: 120,
                  },
                },
              },
            },
            {
              maxWidth: 480,
              options: {
                particles: {
                  number: {
                    value: Math.floor(particleCount * 0.3),
                    density: {
                      enable: true,
                      width: 480,
                      height: 800
                    }
                  },
                  links: {
                    distance: 100,
                  },
                },
              },
            },
          ],
        }}
      />
    </div>
  );
};

export default ParticlesContainer;