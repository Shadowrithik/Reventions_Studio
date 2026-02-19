"use client";
import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";

export default function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    requestAnimationFrame(() => {
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-md transform-gpu ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* The Moving Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(120, 119, 198, 0.2), transparent 40%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}