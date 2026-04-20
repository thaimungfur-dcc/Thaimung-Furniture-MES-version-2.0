import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AspectModal from '../components/AspectModal';
import { motion } from 'motion/react';
import { Settings } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.name}. Here's what's happening today.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
        >
          <Settings size={16} />
          Open Aspect Modal
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Mock Stats Cards */}
        {[
          { name: 'Total Production', stat: '71,897', change: '12%', changeType: 'increase' },
          { name: 'Avg. Cycle Time', stat: '58.16', change: '5.4%', changeType: 'increase' },
          { name: 'Defect Rate', stat: '24.57%', change: '3.2%', changeType: 'decrease' },
        ].map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-black/5 sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
          </motion.div>
        ))}
      </div>

      <AspectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
