import React, { useMemo } from 'react';
import { Activity, Lightbulb, TrendingDown, AlertCircle } from 'lucide-react';
import { calculateDaysDiff, formatDate } from '../utils';

export default function WacdCalc({ invoices }: any) {
  const wacdMetrics = useMemo(() => {
    let totalWeight = 0;
    let totalPaidAmount = 0;
    (invoices || []).forEach((inv: any) => {
      if (inv.balance === 0 && inv.payDate && inv.issueDate) {
        const days = calculateDaysDiff(inv.issueDate, inv.payDate);
        totalWeight += (days * inv.amount);
        totalPaidAmount += inv.amount;
      }
    });
    const wacd = totalPaidAmount > 0 ? Math.round(totalWeight / totalPaidAmount) : 0;
    return { wacd, totalWeight, totalPaidAmount };
  }, [invoices]);

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 border border-white shadow-sm rounded-none mt-2 flex-1 overflow-y-auto custom-scrollbar no-print">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-[#223149] flex items-center gap-2 mb-2">
          <Activity size={24} className="text-[#496ca8]"/> Accounts Receivable: Weighted Avg. Collection Days (WACD)
        </h2>
        <p className="text-[13px] font-medium text-[#7693a6]">
          สูตรคำนวณ: <code className="bg-slate-100 px-2 py-1 rounded text-[#933b5b] font-bold">WACD = ∑ (จำนวนวันที่เก็บเงินได้จริง × มูลค่า Invoice) / ∑ มูลค่า Invoice ทั้งหมด</code>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#f5f0e9] border border-[#496ca8]/30 p-4 text-center">
          <p className="text-[10px] font-bold text-[#7693a6] uppercase tracking-widest mb-1">∑ Total AR Paid</p>
          <p className="text-2xl font-black text-[#223149] font-mono">฿{wacdMetrics.totalPaidAmount?.toLocaleString()}</p>
        </div>
        <div className="bg-[#f5f0e9] border border-[#496ca8]/30 p-4 text-center">
          <p className="text-[10px] font-bold text-[#7693a6] uppercase tracking-widest mb-1">∑ (Days × Amount)</p>
          <p className="text-2xl font-black text-[#496ca8] font-mono">{wacdMetrics.totalWeight?.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-[#223149] to-[#3c5d7d] border border-[#223149] p-4 text-center text-white shadow-md">
          <p className="text-[10px] font-bold text-[#a8bbbf] uppercase tracking-widest mb-1">Resulting AR WACD</p>
          <p className="text-3xl font-black font-mono">{wacdMetrics.wacd} Days</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#f0ede5]/50 to-[#f5f0e9] p-5 rounded-2xl border border-[#d9b343]/30 mb-6 shadow-sm">
        <h3 className="font-black text-[#223149] flex items-center gap-2 text-[14px] uppercase tracking-widest mb-4">
          <Lightbulb size={18} className="text-[#d9b343]"/> AI Suggestion: How to Improve WACD & Reduce Risk
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-3">
            <div className="bg-[#7fa85a]/10 p-2 rounded-lg h-fit text-[#7fa85a]"><TrendingDown size={16}/></div>
            <div>
              <p className="font-bold text-[#223149] text-[11px] uppercase tracking-wider mb-1">Offer Early Payment Discounts</p>
              <p className="text-[10.5px] text-[#7693a6] font-medium leading-relaxed">เสนอส่วนลดเงินสด (Cash Discount) เช่น 2/10 Net 30 เพื่อเป็นแรงจูงใจให้ลูกค้ารีบชำระเงิน ซึ่งจะช่วยดึงค่า WACD ให้ต่ำลงและเพิ่มกระแสเงินสดหมุนเวียนเข้าบริษัทได้เร็วขึ้น</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-3">
            <div className="bg-[#ce5a43]/10 p-2 rounded-lg h-fit text-[#ce5a43]"><AlertCircle size={16}/></div>
            <div>
              <p className="font-bold text-[#223149] text-[11px] uppercase tracking-wider mb-1">Automate Reminders & Strict Credit</p>
              <p className="text-[10.5px] text-[#7693a6] font-medium leading-relaxed">ตั้งระบบส่งอีเมลแจ้งเตือนล่วงหน้า 3 วันก่อนครบกำหนด และพิจารณาใช้มาตรการระงับเครดิต (Credit Hold) ทันทีสำหรับลูกหนี้ High Risk ที่มีประวัติค้างชำระเกิน 15 วันเพื่อป้องกันหนี้สูญ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border border-[#cbd5e1]">
        <table className="w-full text-right text-[11px]">
          <thead className="bg-gradient-to-r from-[#223149] to-[#3c5d7d] text-white">
            <tr>
              <th className="px-4 py-4 font-bold text-left uppercase tracking-widest">Invoice No.</th>
              <th className="px-4 py-4 font-bold text-left uppercase tracking-widest">Customer</th>
              <th className="px-4 py-4 font-bold text-center uppercase tracking-widest">Issue Date</th>
              <th className="px-4 py-4 font-bold text-center uppercase tracking-widest">Payment Date</th>
              <th className="px-4 py-4 font-bold text-center text-[#f2b33d] uppercase tracking-widest">Actual Days (A)</th>
              <th className="px-4 py-4 font-bold text-[#a8bbbf] uppercase tracking-widest">Amount (B)</th>
              <th className="px-4 py-4 font-bold text-[#7fa85a] uppercase tracking-widest">Weight (A × B)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {invoices?.filter((i: any) => i.balance === 0 && i.payDate)?.map((row: any, i: number) => {
              const days = calculateDaysDiff(row.issueDate, row.payDate);
              const weight = days * row.amount;
              return (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-left font-mono">{row.invNo}</td>
                  <td className="px-4 py-3 font-medium text-left text-slate-600">{row.customer}</td>
                  <td className="px-4 py-3 font-mono text-center text-slate-600">{formatDate(row.issueDate)}</td>
                  <td className="px-4 py-3 font-mono text-center text-[#7fa85a] font-semibold">{formatDate(row.payDate)}</td>
                  <td className="px-4 py-3 font-bold text-center text-[#ce5a43]">{days}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-[#223149]">฿{row.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono font-bold text-[#496ca8]">{weight?.toLocaleString()}</td>
                </tr>
              );
            })}
            {invoices?.filter((i: any) => i.balance === 0 && i.payDate).length === 0 && (
              <tr><td colSpan={7} className="text-center py-6 text-[#7693a6] font-bold">No paid invoices with payment dates available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
