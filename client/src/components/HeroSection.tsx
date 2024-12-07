import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "./ui/button";
import { SearchIcon, PlusCircleIcon, TreePine, Sprout } from "lucide-react";
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

const HeroSection: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => {
        heroElement.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <motion.section
      ref={heroRef}
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        backgroundImage: `radial-gradient(
          circle at ${mousePosition.x}% ${mousePosition.y}%, 
          rgba(16, 185, 129, 0.3), 
          rgba(17, 24, 39, 0.9) 60%
        )`
      }}
      className="relative text-white py-24 overflow-hidden bg-slate-900"
    >
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10">
          <TreePine className="text-emerald-500" size={100} />
        </div>
        <div className="absolute bottom-10 right-10">
          <Sprout className="text-emerald-500" size={80} />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ scale: 0.9, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center"
        >
          <h1 className="text-6xl font-extrabold mb-4">
            Crypto Garden
          </h1>
          <p className="text-2xl mb-8 text-slate-200 max-w-2xl mx-auto">
            Cultivate Your Crypto Investments: Discover High ROI Pools Across the Ethereum Ecosystem
          </p>

          <div className="flex justify-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/">
                <Button 
                  variant="outline" 
                  className="bg-slate-800/50 hover:bg-slate-700/70 border-emerald-500/30"
                >
                  <SearchIcon className="mr-2" /> Explore Pools
                </Button>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/create">
                <Button className="bg-emerald-600/80 hover:bg-emerald-700/90">
                  <PlusCircleIcon className="mr-2" /> Create Pool
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;