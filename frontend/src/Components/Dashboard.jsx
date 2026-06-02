import React, { useState, useEffect } from 'react';
import { useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESS, PriceTracking_ABI } from '../constants.js';
import PriceCard from './PriceCard';
import PriceChart from './PriceChart';
import TransactionLogs from './TransactionLogs';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Dashboard() {
  const { writeContract, isPending } = useWriteContract();
  const [logs, setLogs] = useState([]);
  
  // const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/1754430/defi-price-tracker/version/latest';
 
  const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/1754430/defi-price-tracker/v0.0.15';

  const fetchLogs = async () => {
    try {
      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `{ 
            priceRecords(first: 50, orderBy: timestamp, orderDirection: desc) { 
              id 
              token 
              price 
              timestamp 
            } 
          }`
        }),
      });
      const result = await response.json();
      
      if (result.data?.priceRecords) {
        // Mapping and formatting
        const formatted = result.data.priceRecords.map(record => ({
          ...record,
          price: Number(record.price) / 1e8,
        }));
        
        // Ensure state is updated atomically to prevent partial UI renders
        setLogs(formatted);
      }
    } catch (err) {
      console.error('Subgraph fetch error:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    // 15 seconds is fine, but if indexing is very slow, 
    // you could reduce this to 8000 (8 seconds)
    const interval = setInterval(fetchLogs, 8000); 
    return () => clearInterval(interval);
  }, []);

  const handleLogPrice = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: PriceTracking_ABI,
      functionName: 'logLatestPrice',
      gas: 300000n,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex justify-end">
        <ConnectButton />
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* ... (Header and Button remain the same) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div>
             <h1 className="text-2xl font-bold tracking-tight text-slate-900">Price Feed Dashboard</h1>
             <p className="text-sm text-slate-500 mt-1">Real-time assets tracking on Base Sepolia Network.</p>
           </div>
           <button
             onClick={handleLogPrice}
             disabled={isPending}
             className={`px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer ${
               isPending ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
             }`}
           >
             {isPending ? 'Confirming...' : 'Log Latest Price'}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PriceCard token="Ethereum" symbol="ETH" readFunction="getLatestETH" />
          <PriceCard token="Bitcoin" symbol="BTC" readFunction="getLatestBTC" />
          <PriceCard token="Chainlink" symbol="LINK" readFunction="getLatestLINK" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2 min-h-[400px] flex flex-col">
                <PriceChart logs={logs} />
            </div>
            <div className="lg:col-span-1 flex flex-col">
                <TransactionLogs logs={logs} />
            </div>
        </div>
      </main>
    </div>
  );
}