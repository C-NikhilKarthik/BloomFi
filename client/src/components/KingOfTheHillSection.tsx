import React from 'react';
import { motion } from 'framer-motion';
import { CrownIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const KingOfTheHillSection: React.FC = () => {
  return (
    <motion.section
      id="king"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="bg-slate-800 py-16"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8 flex items-center justify-center">
          <CrownIcon className="mr-4 text-yellow-500" /> King of the Hill
        </h2>

        <motion.div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((pool, index) => (
            <motion.div key={index}>
              <Card className="bg-slate-700 text-white border-none hover:scale-105 transition-transform shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Top Pool #{index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span>ROI: {(Math.random() * 100).toFixed(2)}%</span>
                    <span className="text-emerald-400">+$124K</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span>Market Cap:</span>
                    <span className="text-yellow-400">$5.6M</span>
                  </div>
                  <p className="text-slate-300 text-sm mb-4">A brief description of the pool, including its benefits and features.</p>
                  <div className="text-sm text-slate-400">Created by: User {index + 1}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default KingOfTheHillSection;
