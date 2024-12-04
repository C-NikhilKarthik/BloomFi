import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ExplorePools from './page/ExplorePools';
import CreatePool from './page/CreatePool';
import KingOfTheHillSection from './components/KingOfTheHillSection';
import PoolCardsSection from './components/PoolCardsSection';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState("");

  return (
    <Router>
      <div className="bg-slate-900 text-white">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
              <div className="ml-16">
                <HeroSection />
                <KingOfTheHillSection />
                <PoolCardsSection />
              </div>
            </>
          } />

          <Route path="/explore" element={<ExplorePools />} />
          <Route path="/create" element={<CreatePool />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
