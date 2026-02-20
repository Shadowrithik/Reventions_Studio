"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  ArrowRight, Sparkles, Cpu, Globe, Layers, Zap, Code2, 
  Palette, Brain, ShieldCheck, ChevronRight, Box 
} from "lucide-react";

const ParticlesGL = dynamic(
  () => import("./components/ParticlesGL"),
  { ssr: false }
);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0">
        <ParticlesGL />
      </div>

      {/* GLASS SYSTEM */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.03] mix-blend-overlay" />
        <div className="fixed inset-0 opacity-[0.03] mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative z-10 pointer-events-none">
        
        {/* NAVBAR */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 pointer-events-auto">
          <div className="flex items-center justify-between px-6 md:px-8 py-3 md:py-4 rounded-full bg-black/20 backdrop-blur-3xl border border-white/10 shadow-2xl">
            <div className="text-[10px] tracking-[0.5em] font-bold uppercase flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]" />
              REVENTIONS
            </div>
            <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] text-white/40">
              <a href="#forge" className="hover:text-white transition">The Forge</a>
              <a href="#labs" className="hover:text-white transition">Labs</a>
              <a href="#protocol" className="hover:text-white transition">Protocol</a>
            </div>
            <button className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer">
              Launch
            </button>
          </div>
        </nav>

        {/* HERO SECTION - Responsive Clamp */}
        <motion.section 
          style={{ opacity, scale }}
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 md:pt-40"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-[9px] uppercase tracking-[0.4em] mb-12 text-white/60">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Creative Manufacturing v4.2
          </div>

          {/* Hero text clamping ensures it never overflows the screen width */}
          <h1 className="w-full max-w-full text-[clamp(2.5rem,10vw,10rem)] font-bold leading-[0.85] tracking-tighter uppercase select-none px-4">
            REVENTIONS <br />
            <span className="inline-block pr-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/10 italic">
              STUDIO
            </span>
          </h1>

          <p className="mt-8 md:mt-12 max-w-2xl mx-auto text-white/30 text-sm md:text-xl font-light tracking-wide italic px-4 leading-relaxed">
            A solo creative forge manufacturing high-fidelity tech, 
            cinematic interfaces, and neural systems.
          </p>

          <div className="mt-12 md:mt-16 flex flex-col sm:flex-row gap-6 justify-center pointer-events-auto w-full sm:w-auto px-10 sm:px-0">
            <button className="group px-14 py-4 md:py-5 bg-white text-black rounded-full uppercase tracking-[0.2em] text-[10px] font-bold flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all cursor-pointer">
              Start Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-14 py-4 md:py-5 border border-white/10 rounded-full uppercase tracking-[0.2em] text-[10px] text-white/50 backdrop-blur-xl hover:bg-white/5 hover:text-white transition cursor-pointer">
              The Protocol
            </button>
          </div>
        </motion.section>

        {/* FORGE SECTION - Adaptive Grid */}
        <section id="forge" className="py-32 md:py-60 px-6 max-w-7xl mx-auto pointer-events-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="md:col-span-2 relative group p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-2xl overflow-hidden">
              <div className="relative z-10">
                <Palette className="w-10 h-10 text-fuchsia-400 mb-8" />
                <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">InkSpire</h3>
                <p className="text-white/40 max-w-md italic font-light leading-relaxed">A crystalline canvas for visual inspiration. Mapping human creativity into digital reality.</p>
                <button className="mt-10 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition group">
                  View Specs <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </button>
              </div>
              <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Box className="w-48 md:w-64 h-48 md:h-64 rotate-12" />
              </div>
            </div>

            <div className="p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-2xl">
              <Brain className="w-10 h-10 text-cyan-400 mb-8" />
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4">AI-RAG</h3>
              <p className="text-white/40 text-sm italic font-light leading-relaxed">Intelligence grounded in data. Zero hallucinations, pure context.</p>
            </div>

            <div className="p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-2xl">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mb-8" />
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4">Audit_Flow</h3>
              <p className="text-white/40 text-sm italic font-light leading-relaxed">Zero-defect precision auditing. Process verification for technical systems.</p>
            </div>

            <div className="md:col-span-2 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-purple-500/10 to-transparent border border-white/10 backdrop-blur-2xl">
              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                <div className="flex-1 text-left">
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest mb-4">The Forge Stack</h3>
                  <div className="flex gap-6 opacity-30">
                    <Code2 className="w-6 h-6" />
                    <Cpu className="w-6 h-6" />
                    <Zap className="w-6 h-6" />
                    <Globe className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-2 font-medium">Polymath & Lead Architect</p>
                  <p className="text-lg font-bold tracking-widest uppercase">Rithik Kumar</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LABS SECTION - FIXED WATERMARK */}
        <motion.section 
          id="labs" 
          className="py-40 md:py-60 px-6 text-center relative pointer-events-auto overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <h2 className="text-3xl md:text-7xl font-bold uppercase tracking-tighter mb-10">
            Experimental Labs
          </h2>
          <p className="mt-8 text-white/30 max-w-2xl mx-auto text-base md:text-lg italic px-4">
            Prototyping the intersections of robotics, neural networks, 
            and immersive digital manufacturing.
          </p>

          {/* FIXED WATERMARK: Uses clamp to ensure it stays within tablet and laptop bounds */}
          <div
            ref={textRef}
            className="
              mt-24 md:mt-32
              text-[clamp(4rem,12vw,12rem)]
              font-bold
              text-white/[0.03]
              uppercase
              tracking-tighter
              leading-[0.9]
              select-none
              transition-all
              duration-1000
              hover:text-white/10
              w-full
              px-4
            "
          >
            REVENTIONS
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="py-20 md:py-32 border-t border-white/5 bg-[#050505] relative z-10 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div>
              <div className="text-xs tracking-[0.5em] font-bold uppercase mb-4">REVENTIONS STUDIO</div>
              <p className="text-white/20 text-[10px] uppercase tracking-widest leading-loose">
                Forged in Chennai <br />
                Deployed Worldwide.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-12 text-[10px] uppercase tracking-[0.3em] text-white/40">
              <a href="https://www.youtube.com/@the_rithism" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Youtube</a>
              <a href="https://github.com/Shadowrithik" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a>
              <a href="https://www.instagram.com/the_rithism/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Instagram</a>            
            </div>
            <div className="md:text-right text-[10px] uppercase tracking-widest text-white/20 font-mono">
              © 2026 Studio Reventions &middot; [ Built for the void ]
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
