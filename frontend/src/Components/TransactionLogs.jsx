

export default function TransactionLogs({ logs }) {
  if (!logs || logs.length === 0)
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Recent Events</h3>
        <p className="text-sm text-slate-400">No events yet. Click "Log Latest Price"!</p>
      </div>
    );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4">Recent Events</h3>
          {logs.slice(0, 10).map(log => {
  // Create a Date object from the blockchain timestamp
  const date = new Date(log.timestamp * 1000);
  
  return (
    <div key={log.id} className="p-3 border-b border-slate-100 flex justify-between items-center">
      <p className="font-mono text-blue-600 font-bold text-sm">
        {log.token}: ${log.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
      <p className="text-xs text-slate-400">
            {new Date(log.timestamp * 1000).toLocaleDateString('en-US', {
              month: 'short', 
              day: 'numeric', 
              year: 'numeric'
          }) + ' · ' + new Date(log.timestamp * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit', 
            minute: '2-digit'
          })}
      </p>
    </div>
  );
})}
    </div>
  );
}