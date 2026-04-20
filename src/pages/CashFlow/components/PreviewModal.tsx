import React from 'react';
import { X, Printer } from 'lucide-react';

interface PreviewModalProps {
  type: 'print' | 'statement' | null;
  onClose: () => void;
  onConfirm: () => void;
  selectedMonth: string;
  subTab: string;
  filteredData: any[];
  completedItems: any[];
  stats: any;
  beginBalance: number;
}

export default function PreviewModal({ 
  type, 
  onClose, 
  onConfirm, 
  selectedMonth, 
  subTab, 
  filteredData, 
  completedItems, 
  stats, 
  beginBalance 
}: PreviewModalProps) {
  if (!type) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isStatement = type === 'statement';
  const modalColor = isStatement ? 'bg-[#ab8a3b]' : 'bg-[#7397a8]';

  return (
    <div className="fixed inset-0 bg-[#111f42]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 no-print">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none">
        <div className={`px-6 py-4 flex justify-between items-center text-white no-print ${modalColor}`}>
          <h2 className="text-lg font-semibold uppercase tracking-widest flex items-center gap-2">
            <Printer size={20} /> {isStatement ? 'Print Cash Flow Statement' : 'Print Transactions PDF'}
          </h2>
          <button onClick={onClose} className="hover:bg-black/20 p-1.5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-slate-200 flex justify-center print:bg-white print:overflow-visible print:p-0">
          <div className="bg-white p-6 md:p-8 shadow-md w-full max-w-[794px] min-h-[1123px] h-max flex flex-col print:shadow-none print:max-w-none print:w-auto print:min-h-0 print:p-0 mx-auto print:mx-0 text-slate-800">
            
            <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-[#111f42] pb-4 mb-4 text-[#111f42] gap-4">
              <div className="space-y-0.5">
                <h2 className="text-lg md:text-xl font-black tracking-tight">บริษัท ไทยมั่งเฟอร์นิเจอร์ จํากัด</h2>
                <p className="text-sm font-semibold">Thaimung Furniture Co., Ltd.</p>
                <p className="text-[10px] font-bold mt-1 pt-1">เลขประจำตัวผู้เสียภาษี/TAX ID : 0105546077645</p>
              </div>
              <div className="md:text-right text-[10px] space-y-1 md:max-w-[400px] font-medium leading-relaxed">
                <p>สำนักงานใหญ่ : เลขที่ 22/88 หมู่ที่ 3 ตําบลท่าเสา อําเภอกระทุ่มแบน จังหวัดสมุทรสาคร 74110</p>
                <p>Head Office : 22/88 Moo 3, Tha Sao, Krathum Baen, Samut Sakhon 74110</p>
                <div className="flex flex-col md:flex-row md:justify-end gap-1 md:gap-4 mt-1">
                  <p>TEL. 082-569-5654, 091-516-5999</p>
                  <p>E-mail : thaimungfurniture.dcc@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-lg font-black text-[#111f42] uppercase tracking-widest">
                {isStatement ? 'Statement of Cash Flows' : 'Cash Flow Transactions Report'}
              </h3>
              <p className="text-slate-600 font-bold mt-1 text-[10px]">
                {isStatement ? `For the period: ${selectedMonth}` : `Period: ${selectedMonth} | Type: ${subTab.toUpperCase()}`}
              </p>
            </div>
            
            <div className="flex-1 text-[10px]">
              {isStatement ? (
                <div className="text-[12px]">
                  {/* CFO Section */}
                  <div className="mb-4">
                    <div className="font-bold text-xs uppercase bg-[#f0f4f8] text-[#6b7556] border-l-4 border-[#6b7556] px-3 py-2 mb-2 rounded-r-sm">
                      Cash flows from operating activities (CFO)
                    </div>
                    <table className="w-full">
                      <tbody>
                        {completedItems.filter(i => i.flowType === 'CFO').map(item => (
                          <tr key={item.id} className="border-b border-slate-100">
                            <td className="py-1.5 pl-3">{item.description}</td>
                            <td className="py-1.5 pr-2 text-right font-mono">{item.type === 'Out' ? `(฿${item.amount.toLocaleString()})` : `฿${item.amount.toLocaleString()}`}</td>
                          </tr>
                        ))}
                        <tr className="font-bold text-[#6b7556]">
                          <td className="py-2 pl-3 border-t-2 border-[#6b7556]/30">Net cash provided by (used in) operating activities</td>
                          <td className="py-2 pr-2 text-right font-mono border-t-2 border-[#6b7556]/30">{stats.netCFO < 0 ? `(฿${Math.abs(stats.netCFO).toLocaleString()})` : `฿${stats.netCFO.toLocaleString()}`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* CFI Section */}
                  <div className="mb-4">
                    <div className="font-bold text-xs uppercase bg-orange-50 text-[#d97706] border-l-4 border-[#d97706] px-3 py-2 mb-2 rounded-r-sm">
                      Cash flows from investing activities (CFI)
                    </div>
                    <table className="w-full">
                      <tbody>
                        {completedItems.filter(i => i.flowType === 'CFI').map(item => (
                          <tr key={item.id} className="border-b border-slate-100">
                            <td className="py-1.5 pl-3">{item.description}</td>
                            <td className="py-1.5 pr-2 text-right font-mono">{item.type === 'Out' ? `(฿${item.amount.toLocaleString()})` : `฿${item.amount.toLocaleString()}`}</td>
                          </tr>
                        ))}
                        {completedItems.filter(i => i.flowType === 'CFI').length === 0 && <tr><td colSpan={2} className="py-1.5 pl-3 text-slate-400 italic">No transactions</td></tr>}
                        <tr className="font-bold text-[#d97706]">
                          <td className="py-2 pl-3 border-t-2 border-[#d97706]/30">Net cash provided by (used in) investing activities</td>
                          <td className="py-2 pr-2 text-right font-mono border-t-2 border-[#d97706]/30">{stats.netCFI < 0 ? `(฿${Math.abs(stats.netCFI).toLocaleString()})` : `฿${stats.netCFI.toLocaleString()}`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* CFF Section */}
                  <div className="mb-6">
                    <div className="font-bold text-xs uppercase bg-purple-50 text-[#5b21b6] border-l-4 border-[#5b21b6] px-3 py-2 mb-2 rounded-r-sm">
                      Cash flows from financing activities (CFF)
                    </div>
                    <table className="w-full">
                      <tbody>
                        {completedItems.filter(i => i.flowType === 'CFF').map(item => (
                          <tr key={item.id} className="border-b border-slate-100">
                            <td className="py-1.5 pl-3">{item.description}</td>
                            <td className="py-1.5 pr-2 text-right font-mono">{item.type === 'Out' ? `(฿${item.amount.toLocaleString()})` : `฿${item.amount.toLocaleString()}`}</td>
                          </tr>
                        ))}
                        {completedItems.filter(i => i.flowType === 'CFF').length === 0 && <tr><td colSpan={2} className="py-1.5 pl-3 text-slate-400 italic">No transactions</td></tr>}
                        <tr className="font-bold text-[#5b21b6]">
                          <td className="py-2 pl-3 border-t-2 border-[#5b21b6]/30">Net cash provided by (used in) financing activities</td>
                          <td className="py-2 pr-2 text-right font-mono border-t-2 border-[#5b21b6]/30">{stats.netCFF < 0 ? `(฿${Math.abs(stats.netCFF).toLocaleString()})` : `฿${stats.netCFF.toLocaleString()}`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Section */}
                  <div className="border-t-4 border-[#111f42] pt-4 mt-8">
                    <table className="w-full text-sm font-bold text-[#111f42]">
                      <tbody>
                        <tr>
                          <td className="py-2 pl-3">Net increase (decrease) in cash</td>
                          <td className="py-2 pr-2 text-right font-mono">{stats.netFlow < 0 ? `(฿${Math.abs(stats.netFlow).toLocaleString()})` : `฿${stats.netFlow.toLocaleString()}`}</td>
                        </tr>
                        <tr>
                          <td className="py-2 pl-3 text-slate-500">Cash balance at beginning of period</td>
                          <td className="py-2 pr-2 text-right font-mono text-slate-500">฿{beginBalance.toLocaleString()}</td>
                        </tr>
                        <tr className="text-lg border-t-2 border-slate-300">
                          <td className="py-3 pl-3">Cash balance at end of period</td>
                          <td className="py-3 pr-2 text-right font-mono text-[#ab8a3b]">฿{stats.endBalance.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left border-b border-slate-200">
                  <thead className="bg-slate-50 border-y border-slate-200">
                    <tr>
                      <th className="px-2 py-1.5 font-bold text-slate-700 uppercase">Date</th>
                      <th className="px-2 py-1.5 font-bold text-slate-700 uppercase">Ref No.</th>
                      <th className="px-2 py-1.5 font-bold text-slate-700 uppercase">Description</th>
                      <th className="px-2 py-1.5 font-bold text-slate-700 uppercase text-center">Flow</th>
                      <th className="px-2 py-1.5 font-bold text-slate-700 uppercase text-right">Inflow</th>
                      <th className="px-2 py-1.5 font-bold text-slate-700 uppercase text-right">Outflow</th>
                      <th className="px-2 py-1.5 font-bold text-slate-700 uppercase text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredData.length > 0 ? (
                      filteredData.map((item, i) => (
                        <tr key={i}>
                          <td className="px-2 py-1.5 font-medium">{formatDate(item.date)}</td>
                          <td className="px-2 py-1.5 font-semibold text-[#111f42]">{item.ref}</td>
                          <td className="px-2 py-1.5 font-medium">{item.description}</td>
                          <td className="px-2 py-1.5 font-medium text-center">{item.flowType}</td>
                          <td className="px-2 py-1.5 font-bold text-right text-[#6b7556]">{item.type === 'In' ? item.amount.toLocaleString() : '-'}</td>
                          <td className="px-2 py-1.5 font-bold text-right text-[#E3624A]">{item.type === 'Out' ? item.amount.toLocaleString() : '-'}</td>
                          <td className="px-2 py-1.5 font-bold text-right">{item.status === 'Completed' ? (item.balance || 0).toLocaleString() : 'Draft'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={7} className="text-center py-3 text-slate-400 italic">No records found.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl no-print">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors uppercase tracking-wider">Cancel</button>
          <button 
            onClick={onConfirm} 
            className={`px-6 py-2.5 rounded-lg font-semibold text-white shadow-md hover:opacity-90 transition-all uppercase tracking-wider flex items-center gap-2 ${modalColor}`}
          >
            <Printer size={16}/> Confirm Print
          </button>
        </div>
      </div>
    </div>
  );
}
