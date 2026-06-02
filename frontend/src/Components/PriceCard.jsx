import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, PriceTracking_ABI } from '../constants.js';
import { formatUnits } from 'viem';

export default function PriceCard({ token, symbol, change, isPositive, rpcDelay, readFunction }) {
  const { data: price, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PriceTracking_ABI,
    functionName: readFunction, // Dynamic read call execution
    query: {
      refetchInterval: 10000, // Poll RPC nodes directly every 10 seconds
    },
  });

  const displayPrice = (() => {
    if (isLoading) return 'Loading...';
    if (isError || price === undefined) return 'N/A';
    try {
      return parseFloat(formatUnits(BigInt(price), 8)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch {
      return 'Error';
    }
  })();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-bold text-slate-400 uppercase">{token} · {symbol}</p>
      <h3 className="text-2xl font-bold mt-1 text-slate-900">${displayPrice}</h3>
      {change && (
        <p className={`text-sm mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </p>
      )}
      {rpcDelay && <p className="text-xs text-slate-400 mt-2">RPC Feed: {rpcDelay}</p>}
    </div>
  );
}