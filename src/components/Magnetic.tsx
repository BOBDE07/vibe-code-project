import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
}

export default function Magnetic({ children, strength = 0.5 }: MagneticProps) {
  const magneticRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = magneticRef.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "x", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.8, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const threshold = 150;

      if (distance < threshold) {
        // Smoothly interpolate the strength based on distance
        const power = (1 - distance / threshold) * strength;
        xTo(deltaX * power);
        yTo(deltaY * power);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return React.cloneElement(children, { ref: magneticRef } as React.Attributes);
}
