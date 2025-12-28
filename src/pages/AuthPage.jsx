import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        } else {
          setMsg("Registered! Please login.");
          setIsLogin(true);
        }
      } else {
        setMsg(data.error);
      }
    } catch (err) {
      setMsg("Server not running.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-20 px-4">
      {/* Used your specific glassmorphism classes: bg-white/5 border-white/10 */}
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow similar to your Home page */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <h2 className="text-3xl font-black text-center mb-6 tracking-tight">
          {isLogin ? "Welcome Back" : "Join the Grid"}
        </h2>
        
        {msg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl mb-6 text-sm text-center">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold tracking-wider ml-1">Username</label>
            <input 
              className="mt-1 w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-gray-600" 
              placeholder="Enter username" 
              required
              onChange={e => setForm({...form, username: e.target.value})} 
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold tracking-wider ml-1">Password</label>
            <input 
              className="mt-1 w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-gray-600" 
              type="password" 
              placeholder="••••••••" 
              required
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>
          
          <button className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-900/20 transition-all transform active:scale-95">
            {isLogin ? "Login to Dashboard" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setMsg(""); }} 
            className="text-sm text-gray-400 hover:text-cyan-300 transition-colors"
          >
            {isLogin ? "New here? " : "Already have an account? "}
            <span className="underline decoration-2 underline-offset-4">{isLogin ? "Sign Up" : "Login"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}