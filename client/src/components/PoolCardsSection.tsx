import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const PoolCardsSection: React.FC = () => {
  return (
    <section id="pools" className="bg-slate-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Available Pools
        </h2>

        <motion.div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((pool, index) => (
            <motion.div key={index}>
              <Card className="bg-slate-800 text-white border-none hover:scale-105 transition-transform shadow-xl">
                <CardHeader>
                  <CardTitle>Pool #{index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>TVL:</span>
                      <span className="text-emerald-400">$1.2M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI:</span>
                      <span className="text-yellow-400">
                        {(Math.random() * 50).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span>Market Cap:</span>
                      <span className="text-yellow-400">$3.5M</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-4">This pool is a high-yielding investment in the crypto ecosystem.</p>
                    <div className="text-sm text-slate-400">Created by: User {index + 1}</div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Stake Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PoolCardsSection;
