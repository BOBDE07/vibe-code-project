/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import CustomCursor from './components/CustomCursor';
import Magnetic from './components/Magnetic';
import { motion, useScroll, useSpring, useMotionValue, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins once at the top level
gsap.registerPlugin(ScrollTrigger);
import { ArrowUpRight, Github, Linkedin, Mail, Twitter } from 'lucide-react';

function MouseGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { damping: 50, stiffness: 300 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 300 });

  const x = useTransform(springX, (v) => `${v}px`);
  const y = useTransform(springY, (v) => `${v}px`);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div 
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-500"
      style={{
        background: `radial-gradient(800px circle at var(--x) var(--y), rgba(139, 92, 246, 0.08), transparent 80%)`,
        // @ts-ignore
        "--x": x,
        // @ts-ignore
        "--y": y
      } as any}
    />
  );
}

function AboutSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-40">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl text-center"
      >
        <div className="inline-block mb-10">
          <span className="text-[11px] uppercase tracking-[0.5em] text-white/30 font-medium px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
            Our Philosophy
          </span>
        </div>
        <h2 className="text-6xl md:text-8xl font-display font-bold text-white mb-12 tracking-tight leading-[1.05]">
          Crafting the <br /> <span className="text-glow text-gradient">Digital Future</span>
        </h2>
        <p className="text-xl md:text-3xl font-sans font-light text-gray-400 leading-relaxed mb-24 max-w-4xl mx-auto">
          We push the boundaries of what's possible on the web. By combining cutting-edge 3D technology with seamless user experiences, we create digital products that don't just work—they inspire.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { title: "Design", desc: "Minimalist aesthetics with maximum impact." },
            { title: "Development", desc: "High-performance code for the modern web." },
            { title: "Experience", desc: "Immersive interactions that tell a story." }
          ].map((item, i) => (
            <Magnetic key={i} strength={0.2}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="p-10 rounded-[2.5rem] glass-card group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
                </div>
                <h3 className="text-2xl text-white font-display font-bold mb-4 tracking-wide group-hover:text-glow transition-all">{item.title}</h3>
                <p className="text-base text-gray-500 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            </Magnetic>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ProjectsSection() {
  const projects = [
    { title: "Nexa OS", category: "System Design", image: "https://picsum.photos/seed/nexa/1200/1600" },
    { title: "Aura AI", category: "Machine Learning", image: "https://picsum.photos/seed/aura/1200/1600" },
    { title: "Void Studio", category: "Creative Agency", image: "https://picsum.photos/seed/void/1200/1600" }
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-40">
      <div className="max-w-7xl w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <span className="text-[11px] uppercase tracking-[0.5em] text-white/30 font-medium mb-6 block">
            Selected Works
          </span>
          <h2 className="text-5xl md:text-8xl font-display font-bold text-white tracking-tighter leading-none">
            Featured <br /> <span className="text-glow text-gradient">Projects</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {projects.map((project, i) => (
            <Magnetic key={i} strength={0.3}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="group relative aspect-[3/4] overflow-hidden rounded-[3rem] glass neon-border cursor-pointer shadow-2xl transition-all duration-700 hover:shadow-purple-500/20"
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 p-10 w-full">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-4 block font-medium">{project.category}</span>
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-display font-bold text-white tracking-tight">{project.title}</h3>
                    <div className="w-14 h-14 rounded-full glass flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-700 rotate-0 group-hover:rotate-45">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Magnetic>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-40">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="max-w-6xl w-full p-20 md:p-32 rounded-[5rem] glass text-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <h2 className="text-6xl md:text-[10rem] font-display font-bold text-white mb-12 tracking-tighter leading-none">
          Let's build <br /> <span className="text-glow text-gradient">together.</span>
        </h2>
        
        <p className="text-xl md:text-2xl font-sans font-light text-gray-400 mb-20 max-w-2xl mx-auto leading-relaxed">
          Have a vision you want to bring to life? We're currently accepting new projects and collaborations.
        </p>

        <Magnetic strength={0.4}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-16 py-6 rounded-full bg-white text-black font-sans font-bold text-sm uppercase tracking-[0.3em] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all duration-700"
          >
            Get in Touch
          </motion.button>
        </Magnetic>

        <div className="mt-32 flex items-center justify-center gap-10 text-white/20">
          {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
            <Magnetic key={i} strength={0.8}>
              <div className="p-4 rounded-full glass hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                <Icon size={24} />
              </div>
            </Magnetic>
          ))}
        </div>
      </motion.div>
      
      <footer className="absolute bottom-12 text-[11px] uppercase tracking-[0.6em] text-white/20 font-medium">
        © 2026 Vibe Code Studio • Crafted for the future
      </footer>
    </section>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="bg-[#050505] selection:bg-white selection:text-black">
      <CustomCursor />
      <MouseGlow />
      
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-white z-[100] origin-left"
        style={{ scaleX }}
      />

      <Hero />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
