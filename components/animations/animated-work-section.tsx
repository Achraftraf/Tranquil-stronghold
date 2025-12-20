"use client"

import { useEffect, useRef, useState } from "react";

interface AnimatedWorkSectionProps {
  children: React.ReactNode;
  delay?: number;
  classNames?: string;
  onClick?: () => void;
}


export const AnimatedWorkSection: React.FC<AnimatedWorkSectionProps> = ({ 
  children, 
  delay = 0, 
  classNames = "",
  onClick 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        } ${classNames}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};