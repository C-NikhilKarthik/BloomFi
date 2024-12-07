import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface PoolToken {
  symbol: string;
  name: string;
  balanceUSD: string;
}

interface Pool {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  poolTokens: PoolToken[];
}

const PoolCardsSection: React.FC = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPools = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api/user/fetch/pools');
        if (!response.ok) {
          throw new Error(`Failed to fetch pools: ${response.statusText}`);
        }
        const data = await response.json();

        // Filter and map relevant data for frontend display
        const formattedPools = data.map((pool: any) => ({
          id: pool.id,
          name: pool.name,
          symbol: pool.symbol,
          chain: pool.chain,
          poolTokens: pool.poolTokens.map((token: any) => ({
            symbol: token.symbol,
            name: token.name,
            balanceUSD: token.balanceUSD,
          })),
        }));
        setPools(formattedPools);
      } catch (error: any) {
        console.error("Error fetching pools:", error);
        setError(error.message || "An error occurred while fetching pools.");
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  if (loading) {
    return <div className="text-center text-white py-8">Loading pools...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-white py-8">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <section id="pools" className="bg-slate-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Available Pools
        </h2>

        {pools.length === 0 ? (
          <p className="text-white text-center">No pools available at the moment.</p>
        ) : (
          <motion.div className="grid md:grid-cols-3 gap-6">
            {pools.map((pool) => (
              <motion.div key={pool.id}>
                <Card className="bg-slate-800 text-white border-none hover:scale-105 transition-transform shadow-xl">
                  <CardHeader>
                    <CardTitle>{pool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Symbol:</span>
                        <span className="text-emerald-400">{pool.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chain:</span>
                        <span className="text-yellow-400">{pool.chain}</span>
                      </div>
                      <div className="text-slate-300 text-sm mb-4">Pool Tokens:</div>
                      <ul className="text-sm text-slate-400">
                        {pool.poolTokens.map((token, index) => (
                          <li key={index} className="mb-2">
                            <span className="text-yellow-400">{token.symbol}</span> - {token.name} (${parseFloat(token.balanceUSD).toFixed(2)})
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Stake Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PoolCardsSection;
