import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header"; // Reusing your existing Header component for consistency

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/auth");
    fetch(`http://localhost:5000/stats/${user.id}`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!stats) return <div className="pt-32 text-center text-gray-400 animate-pulse">Syncing with database...</div>;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mt-5">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">{user.username}</span>
          </h1>
          <p className="text-gray-400 mt-5 text-lg">Your algorithmic journey tracked.</p>
        </div>
        <button 
          onClick={logout} 
          className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 text-gray-300 hover:text-red-200 transition-all text-sm font-semibold"
        >
          Disconnect
        </button>
      </div>

      {/* Stats Cards - Matches FeatureCard style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-cyan-500/20"></div>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Visualizations</div>
          <div className="text-6xl font-black text-white mt-2">{stats.total}</div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-fuchsia-500/20"></div>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Favorite Algorithm</div>
          <div className="text-3xl font-bold text-cyan-300 mt-4 break-words">{stats.favorite}</div>
        </div>
      </div>

      {/* History Table - Matches your list styles */}
      <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h3 className="text-lg font-bold text-gray-200">Recent Database Logs</h3>
        </div>
        <div className="divide-y divide-white/5">
          {stats.history.map((log, i) => (
            <div key={i} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
              <div>
                <div className="font-semibold text-cyan-100 group-hover:text-cyan-400 transition-colors">
                  {log.algorithm_name}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                  {log.algorithm_type}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 font-mono">
                  {new Date(log.execution_time).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-600 font-mono">
                  {new Date(log.execution_time).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {stats.history.length === 0 && (
            <div className="p-12 text-center text-gray-500 italic">
              No data in MySQL yet. Go run an algorithm!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}