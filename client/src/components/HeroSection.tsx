import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "./ui/button";
import { SearchIcon, PlusCircleIcon } from "lucide-react";
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-slate-900 text-white py-24 overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-5xl font-bold mb-6 text-center"
        >
          Crypto Garden
        </motion.h1>
        <p className="text-xl text-center mb-8 text-slate-300">
          Discover High ROI Pools Across Ethereum Ecosystem
        </p>

        <div className="flex justify-center space-x-4">
          <Link to="/explore">
            <Button variant="outline" className="bg-slate-800 hover:bg-slate-700">
              <SearchIcon className="mr-2" /> Explore Pools
            </Button>
          </Link>
          <Link to="/create">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <PlusCircleIcon className="mr-2" /> Create Pool
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
