import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Scene from './Scene';
import Magnetic from './Magnetic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 40;
      const y = (clientY / innerHeight - 0.5) * 40;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    if (!contentRef.current) return;

    gsap.to(contentRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      opacity: 0,
      y: -100,
      ease: "none",
    });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* 3D Scene Background */}
      <Scene />

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] opacity-80" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />

      {/* Content Overlay */}
      <motion.div 
        ref={contentRef} 
        style={{ x: springX, y: springY }}
        className="relative z-10 text-center px-4 max-w-5xl"
      >
        <Magnetic strength={0.2}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-white/60 font-medium">
              Available for new projects
            </span>
          </motion.div>
        </Magnetic>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[clamp(4rem,16vw,14rem)] font-display font-bold leading-[0.8] tracking-[-0.05em] mb-12 mix-blend-difference group relative">
            <span className="relative z-10 text-gradient text-glow">
              Vibe Code
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-8"
        >
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <p className="text-xs md:text-sm font-sans font-light text-white/40 tracking-[0.5em] uppercase max-w-md leading-relaxed">
            Architecting the next generation <br /> of digital experiences
          </p>
        </motion.div>

        <Magnetic strength={0.3}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute -bottom-32 left-1/2 -translate-x-1/2 cursor-pointer group"
          >
            <div className="flex flex-col items-center gap-6">
              <span className="text-[10px] uppercase tracking-[0.6em] text-white/20 font-medium group-hover:text-white/60 transition-all duration-500">Explore</span>
              <div className="relative w-[1px] h-24 bg-white/10 overflow-hidden">
                <motion.div 
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent"
                />
              </div>
            </div>
          </motion.div>
        </Magnetic>
      </motion.div>

      {/* Subtle Vignette */}
      <div className="absolute inset-0 pointer-events-none z-[2] bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_100%)] opacity-80" />
    </section>
  );
}
