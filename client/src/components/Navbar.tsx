import React, { useState } from 'react';
import { Button } from "./ui/button";
import { HomeIcon, CrownIcon, SlidersIcon, WalletIcon } from "lucide-react";

interface NavbarProps {
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 50,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-16 bg-slate-800 text-white shadow-lg flex flex-col items-center justify-between py-4">
      <div className="flex flex-col items-center space-y-4">
        <Button onClick={() => scrollToSection("hero")} className={`w-12 h-12 rounded-full ${activeSection === "hero" ? "bg-emerald-800" : "bg-emerald-600"}`}>
          <HomeIcon />
        </Button>
        <Button onClick={() => scrollToSection("king")} className={`w-12 h-12 rounded-full ${activeSection === "king" ? "bg-emerald-800" : "bg-emerald-600"}`}>
          <CrownIcon />
        </Button>
        <Button onClick={() => scrollToSection("pools")} className={`w-12 h-12 rounded-full ${activeSection === "pools" ? "bg-emerald-800" : "bg-emerald-600"}`}>
          <SlidersIcon />
        </Button>
      </div>
      <Button className="w-12 h-12 bg-emerald-600 flex items-center justify-center rounded-full hover:bg-emerald-700">
        <WalletIcon />
      </Button>
    </div>
  );
};

export default Navbar;
