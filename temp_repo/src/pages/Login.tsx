import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Lock, User as UserIcon, Loader2, Package, ArrowRight, Phone, Mail } from 'lucide-react';
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
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-r from-[#031520] to-[#083A59] p-12 lg:flex">
        {/* Background Image (Shadow/Watermark effect) */}
        <div 
          className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity"
          style={{ 
            backgroundImage: `url('https://www.secureinfo.co.th/wp-content/uploads/2024/11/LINE_ALBUM_StockPhoto_123RF_%E0%B9%92%E0%B9%93%E0%B9%90%E0%B9%91%E0%B9%92%E0%B9%90_38-1024x576-1.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Abstract Background Shapes using the provided palette */}
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#8C2E47] opacity-40 blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#F28241] opacity-30 blur-[100px]"></div>
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#BF533B] opacity-20 blur-[80px]"></div>

        {/* Top Logo Area */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F28241] shadow-lg">
              <Package size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-wider">ENTERPRISE</span>
          </div>
        </div>

        {/* Main Branding Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-7xl font-black tracking-tight text-white">
              WMS
            </h1>
            <h2 className="mt-4 text-3xl font-semibold text-white/90">
              Warehouse Management System
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              Streamline your inventory, optimize logistics, and take full control of your supply chain with our advanced management platform.
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
              <div className="text-3xl font-bold text-[#F28241]">99.9%</div>
              <div className="mt-1 text-sm text-white/60">Inventory Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#F28241]">24/7</div>
              <div className="mt-1 text-sm text-white/60">Real-time Tracking</div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-white/70">
          <div className="font-semibold text-white text-base mb-2">T All Intelligence</div>
          <div className="flex flex-wrap items-center gap-3">
            <span>Smart Solutions</span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1.5"><Phone size={14} /> 082-5695654</span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1.5"><Mail size={14} /> tallintelligence.ho@gmail.com</span>
          </div>
          <div className="mt-4 text-xs text-white/40 tracking-wider">
            &copy; 2026 ALL RIGHTS RESERVED
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
            <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-[#083A59] lg:hidden">
              <Package size={28} className="text-[#F28241]" />
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your credentials to access the system.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium leading-6 text-gray-900">
                  Staff Code
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    required
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#083A59] sm:text-sm sm:leading-6 transition-all"
                    placeholder="e.g., U001 or demo"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="idCard" className="block text-sm font-medium leading-6 text-gray-900">
                  ID Card Number
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="idCard"
                    name="idCard"
                    type="password"
                    required
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#083A59] sm:text-sm sm:leading-6 transition-all"
                    placeholder="13 digits or demo"
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
                className="rounded-lg bg-[#731702]/10 p-4 border border-[#731702]/20"
              >
                <p className="text-sm font-medium text-[#731702]">{error}</p>
              </motion.div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-[#083A59] px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#083A59]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#083A59] disabled:opacity-70 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign in to account
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-8 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-600 border border-gray-100">
              <p className="font-medium text-gray-900 mb-1">Demo Credentials</p>
              <p>User: <span className="font-mono font-medium text-[#083A59]">demo</span> / Pass: <span className="font-mono font-medium text-[#083A59]">demo</span></p>
              <p className="mt-1">Admin: <span className="font-mono font-medium text-[#083A59]">U001</span> / Pass: <span className="font-mono font-medium text-[#083A59]">1234567890123</span></p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

