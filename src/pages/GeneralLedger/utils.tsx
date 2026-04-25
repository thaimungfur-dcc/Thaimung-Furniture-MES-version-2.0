export const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatAmount = (amount: number) => {
  if (amount === 0 || !amount) return '-';
  return amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
