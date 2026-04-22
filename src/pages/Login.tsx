import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Lock, User as UserIcon, Loader2, Package, ArrowRight, Phone, Mail, Armchair } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [idCard, setIdCard] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('login', undefined, { employeeId, idCard });
      
      if (response.status === 'success' && response.data) {
        login(response.data);
        navigate(from, { replace: true });
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-r from-[#111f42] to-[#1c213f] p-12 lg:flex">
        {/* Background Image (Shadow/Watermark effect) */}
        <div 
          className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity"
          style={{ 
            backgroundImage: `url('https://m.media-amazon.com/images/I/61HdK9ACA1L._AC_UF894,1000_QL80_.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 10%'
          }}
        />
        
        {/* Abstract Background Shapes using the provided palette */}
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#952425] opacity-40 blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#E3624A] opacity-30 blur-[100px]"></div>
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ab8a3b] opacity-20 blur-[80px]"></div>

        {/* Top Logo Area */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E3624A] shadow-2xl border border-white/10">
              <Armchair size={24} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-[0.3em] font-mono">SYSTEM GATEWAY</span>
          </div>
        </div>

        {/* Main Branding Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-7xl font-black tracking-tight text-white uppercase drop-shadow-lg font-mono">
              <span style={{ WebkitTextStroke: '1.5px currentColor' }}>FURNITURE</span> <br />
              <span className="text-[#E3624A]">LOGISTICS</span>
            </h1>
            <h2 className="mt-6 text-2xl font-black text-[#ab8a3b] uppercase tracking-[0.4em] font-mono opacity-80">
              Advanced Execution
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-slate-300 font-medium">
              Precision manufacturing control and real-time inventory synchronisation for the modern industrial workspace.
            </p>
          </motion.div>

          {/* Decorative stats/features */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8"
          >
            <div>
              <div className="text-3xl font-bold text-[#E3624A]">99.9%</div>
              <div className="mt-1 text-sm text-white/60">Inventory Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#E3624A]">24/7</div>
              <div className="mt-1 text-sm text-white/60">Real-time Tracking</div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-end justify-between w-full">
          <div className="text-sm text-white/70">
            <div className="font-bold text-white text-lg mb-2">T All Intelligence</div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span>Smart Solutions</span>
              <span className="text-white/30">|</span>
              <span className="flex items-center gap-1.5"><Phone size={14} /> 082-5695654</span>
              <span className="text-white/30">|</span>
            </div>
            <div className="flex items-center gap-1.5 mb-4">
              <Mail size={14} /> tallintelligence.ho@gmail.com
            </div>
            <div className="text-xs text-white/40 tracking-wider uppercase font-semibold">
              &copy; 2026 ALL RIGHTS RESERVED
            </div>
          </div>

          {/* DEV Profile Card */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow-2xl">
            <img 
              src="https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400" 
              alt="Developer" 
              className="w-12 h-12 rounded-xl border-2 border-white/20 object-cover shadow-lg"
            />
            <div>
              <div className="font-black text-white text-[11px] uppercase tracking-widest font-mono">T-DCC AUTHORIZED</div>
              <div className="text-[#E3624A] text-[9px] font-black uppercase tracking-widest mt-0.5">Secure Node Operator</div>
              <div className="text-white/40 text-[9px] mt-1 font-mono">tallintelligence.dcc@gmail.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full items-center justify-center p-8 sm:p-12 lg:w-1/2">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center lg:text-left">
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-[#111f42] lg:hidden border-2 border-[#ab8a3b]">
              <Armchair size={32} className="text-[#E3624A]" />
            </div>
            
            <h2 className="text-4xl font-black tracking-tighter text-[#111f42] uppercase font-mono">
              Operational Gate
            </h2>
            <p className="mt-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">
              Authentication Protocol Required
            </p>
          </div>
          
          <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="employeeId" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2">
                  Staff Identifier
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <UserIcon className="h-5 w-5 text-[#ab8a3b]" />
                  </div>
                  <input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    required
                    className="block w-full rounded-xl border-2 border-slate-100 py-4 pl-12 text-gray-900 shadow-sm focus:ring-0 focus:border-[#ab8a3b] text-sm tracking-widest font-black uppercase transition-all bg-slate-50/50"
                    placeholder="EID CODE"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="idCard" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2">
                  Security Passkey
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Lock className="h-5 w-5 text-[#ab8a3b]" />
                  </div>
                  <input
                    id="idCard"
                    name="idCard"
                    type="password"
                    required
                    className="block w-full rounded-xl border-2 border-slate-100 py-4 pl-12 text-gray-900 shadow-sm focus:ring-0 focus:border-[#ab8a3b] text-sm tracking-widest font-black transition-all bg-slate-50/50"
                    placeholder="•••••••••••••"
                    value={idCard}
                    onChange={(e) => setIdCard(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-rose-50 p-4 border-l-4 border-rose-500"
              >
                <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest">{error}</p>
              </motion.div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-[#111f42] px-6 py-5 text-[12px] font-black text-white shadow-2xl hover:bg-[#0a1229] focus:outline-none transition-all uppercase tracking-[0.3em] font-mono border-b-4 border-[#ab8a3b]"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Grant Access
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-12 rounded-xl bg-slate-50 p-6 border border-slate-200 shadow-inner">
              <p className="font-black text-[#111f42] text-[10px] uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Diagnostic Credentials</p>
              <div className="space-y-3">
                <p className="text-[11px] text-slate-500 flex justify-between">
                  <span className="font-bold">SYSTEM DEBUG:</span> 
                  <span className="font-mono font-black text-[#111f42]">demo / demo</span>
                </p>
                <p className="text-[11px] text-slate-500 flex justify-between">
                  <span className="font-bold">ROOT OPERATOR:</span> 
                  <span className="font-mono font-black text-[#111f42]">U001 / ...123</span>
                </p>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

