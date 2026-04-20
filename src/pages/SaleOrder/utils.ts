import { Order } from './types';

export const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const calculateTotals = (orderData: Partial<Order>) => {
  const items = orderData.items || [];
  const subtotal = items.reduce((acc, i) => acc + ((i.qty || 0) * (i.price || 0)), 0);
  const totalDiscount = items.reduce((acc, i) => acc + (i.discount || 0), 0);
  const afterDiscount = subtotal - totalDiscount;
  
  let vatAmount = 0;
  let grandTotal = afterDiscount;
  const rate = Number(orderData.vatRate) || 7;

  if (orderData.vatType === 'Excl.') {
    vatAmount = afterDiscount * (rate / 100);
    grandTotal = afterDiscount + vatAmount;
  } else if (orderData.vatType === 'Incl.') {
    const preVatTotal = afterDiscount / (1 + rate / 100);
    vatAmount = afterDiscount - preVatTotal;
  }
  return { subtotal, totalDiscount, afterDiscount, vatAmount, grandTotal };
};

export const getStatusStyle = (status: string) => {
  switch(status) {
    case 'Booking': return { wrapperBorder: 'border-slate-200', headerBg: 'bg-slate-100/80', text: 'text-slate-600', bodyBg: 'bg-[#fafafa]', bg: 'bg-slate-100', border: 'border-slate-200' };
    case 'JO Created': return { wrapperBorder: 'border-blue-200', headerBg: 'bg-blue-50/80', text: 'text-blue-700', bodyBg: 'bg-[#fafafa]', bg: 'bg-blue-50', border: 'border-blue-200' };
    case 'Production': return { wrapperBorder: 'border-amber-200', headerBg: 'bg-amber-50/80', text: 'text-amber-700', bodyBg: 'bg-[#fafafa]', bg: 'bg-amber-50', border: 'border-amber-200' };
    case 'Ready to Ship': return { wrapperBorder: 'border-orange-200', headerBg: 'bg-orange-50/80', text: 'text-orange-700', bodyBg: 'bg-[#fafafa]', bg: 'bg-orange-50', border: 'border-orange-200' };
    case 'Delivered': return { wrapperBorder: 'border-emerald-200', headerBg: 'bg-emerald-50/80', text: 'text-emerald-700', bodyBg: 'bg-[#fafafa]', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'Returned': return { wrapperBorder: 'border-rose-200', headerBg: 'bg-rose-50/80', text: 'text-rose-700', bodyBg: 'bg-[#fafafa]', bg: 'bg-rose-50', border: 'border-rose-200' };
    default: return { wrapperBorder: 'border-slate-200', headerBg: 'bg-slate-100/80', text: 'text-slate-600', bodyBg: 'bg-[#fafafa]', bg: 'bg-slate-100', border: 'border-slate-200' };
  }
};
