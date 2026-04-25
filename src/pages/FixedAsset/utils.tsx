export const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatAmount = (amount: number) => {
  if (amount === 0 || !amount) return '-';
  return amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'Maintenance': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'Disposed': return 'bg-rose-50 text-rose-600 border-rose-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};
