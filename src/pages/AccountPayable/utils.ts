export const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const isOverdue = (bill: any) => {
  return bill.balance > 0 && new Date(bill.dueDate) < new Date('2026-03-12') && !bill.isDisputed;
};

export const calculateDaysDiff = (start: string, end: string) => {
  if (!start || !end) return 0;
  const date1 = new Date(start);
  const date2 = new Date(end);
  const diff = Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};
