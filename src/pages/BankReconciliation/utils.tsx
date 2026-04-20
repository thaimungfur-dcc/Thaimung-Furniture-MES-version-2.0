import React from 'react';
import { Link as LinkIcon } from 'lucide-react';

export const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const getFormatAmount = (amt: number | null) => {
  if (amt === null) return <span className="text-slate-300">-</span>;
  return <span className={amt < 0 ? 'text-[#ce5a43]' : 'text-[#223149]'}>{amt < 0 ? `(${Math.abs(amt).toLocaleString()})` : amt.toLocaleString()}</span>;
};

export const getSourceBadge = (source: string) => (
  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[8px] font-bold uppercase border border-indigo-100">
    <LinkIcon size={8}/> {source}
  </span>
);
