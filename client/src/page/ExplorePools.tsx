import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const ExplorePools: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white min-h-screen relative">
      {/* Button in the top-right corner */}
      <div className="absolute top-4 right-4">
        <Link to="/dashboard">
          <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Go to Dashboard
          </Button>
        </Link>
      </div>

      {/* Page content */}
      <h1 className="text-5xl font-bold text-center py-24">Explore Pools</h1>
      <p className="text-xl text-center text-slate-300">
        Here you can explore various high ROI pools in the Ethereum ecosystem.
      </p>
    </div>
  );
};

export default ExplorePools;
