export const AR_CONFIG = {
  columns: [
    { id: 'Pending Billing', title: 'รอวางบิล', color: 'bg-[#7693a6]', border: 'border-[#7693a6]', txt: 'text-[#7693a6]' },
    { id: 'Billed', title: 'วางบิลแล้ว', color: 'bg-[#496ca8]', border: 'border-[#496ca8]', txt: 'text-[#496ca8]' },
    { id: 'Waiting Payment', title: 'รอชำระ', color: 'bg-[#d9b343]', border: 'border-[#d9b343]', txt: 'text-[#d9b343]' },
    { id: 'Overdue', title: 'เกินกำหนด', color: 'bg-[#ce5a43]', border: 'border-[#ce5a43]', txt: 'text-[#ce5a43]' },
    { id: 'Bad Debt', title: 'หนี้สูญ', color: 'bg-[#933b5b]', border: 'border-[#933b5b]', txt: 'text-[#933b5b]' },
    { id: 'Paid', title: 'ชำระแล้ว', color: 'bg-[#7fa85a]', border: 'border-[#7fa85a]', txt: 'text-[#7fa85a]' },
  ],
  currentDate: '2026-03-12'
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const isOverdue = (inv: any) => {
  return inv.balance > 0 && new Date(inv.dueDate) < new Date(AR_CONFIG.currentDate) && !inv.isBadDebt;
};

export const calculateDaysDiff = (start: string, end: string) => {
  if (!start || !end) return 0;
  const date1 = new Date(start);
  const date2 = new Date(end);
  const diff = Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};
