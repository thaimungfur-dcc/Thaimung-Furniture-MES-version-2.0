import React from 'react';
import { Car, Coffee, Package, FileText, Link as LinkIcon } from 'lucide-react';

export const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const getCategoryIcon = (cat: string) => {
  if (cat.includes('Travel')) return <Car size={14} className="inline mr-1 text-[#496ca8]" />;
  if (cat.includes('Meals')) return <Coffee size={14} className="inline mr-1 text-[#d9b343]" />;
  if (cat.includes('Supplies')) return <Package size={14} className="inline mr-1 text-[#7fa85a]" />;
  return <FileText size={14} className="inline mr-1 text-[#df8a5d]" />;
};

export const getSourceBadge = (source: string) => (
  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[8px] font-bold uppercase border border-indigo-100">
    <LinkIcon size={8}/> {source}
  </span>
);
