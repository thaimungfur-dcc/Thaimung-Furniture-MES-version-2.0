import React from 'react';
import { Printer, Download, X, TrendingUp, Receipt } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface VatRecord {
  id: number;
  date: string;
  type: string;
  invoice: string;
  customer: string;
  amount: number;
  vat: number;
  total: number;
  status: string;
}

interface VatPreviewModalProps {
  previewModal: 'print' | 'csv' | null;
  onClose: () => void;
  onConfirm: () => void;
  selectedMonth: string;
  vatSubTab: string;
  filteredData: VatRecord[];
  totalSalesVat: number;
  totalPurchaseVat: number;
}

const VatPreviewModal: React.FC<VatPreviewModalProps> = ({ 
  previewModal, 
  onClose, 
  onConfirm, 
  selectedMonth, 
  vatSubTab, 
  filteredData,
  totalSalesVat,
  totalPurchaseVat
}) => {
  if (!previewModal) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-[#111f42]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 no-print">
      
          <DraggableWrapper>
                <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none">
                  <div className={`px-6 py-2.5 flex justify-between items-center text-white no-print ${previewModal === 'print' ? 'bg-[#ab8a3b]' : 'bg-[#7397a8]'}`}>
                    <h2 className="text-lg font-semibold uppercase tracking-widest flex items-center gap-2">
                      {previewModal === 'print' ? <Printer size={20} /> : <Download size={20} />} 
                      Preview {previewModal === 'print' ? 'Print Document' : 'CSV Export'}
                    </h2>
                    <button onClick={onClose} className="hover:bg-black/20 p-1.5 rounded-lg transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-4 md:p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-200 flex justify-center print:bg-white print:overflow-visible print:p-0">
                    <div className="bg-white p-4 sm:p-5 md:p-5 shadow-md w-full max-w-[794px] min-h-[1123px] h-max flex flex-col print:shadow-none print:max-w-none print:w-auto print:min-h-0 print:p-0 mx-auto print:mx-0">
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

                      <div className="text-center mb-5">
                        <h3 className="text-lg font-black text-[#111f42] uppercase tracking-widest">VAT Report / รายงานภาษี</h3>
                        <p className="text-slate-600 font-bold mt-1 text-[10px]">Period: {selectedMonth} | Type: {vatSubTab.toUpperCase()}</p>
                      </div>
                      
                      <div className="flex-1">
                        {(vatSubTab === 'all' || vatSubTab === 'sales') && (
                          <div className="mb-6 break-inside-avoid">
                            <h4 className="font-bold text-[#E3624A] uppercase tracking-widest text-xs mb-2 border-b-2 border-[#E3624A] pb-1.5 flex items-center gap-2">
                              <TrendingUp size={14} /> Sales VAT (Output Tax) / รายงานภาษีขาย
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-[10px] border-b border-slate-200">
                                <thead className="bg-slate-50 border-y border-slate-200">
                                  <tr>
                                    <th className="px-2 py-1.5 font-bold text-slate-700 uppercase">Date</th>
                                    <th className="px-2 py-1.5 font-bold text-slate-700 uppercase">Inv No.</th>
                                    <th className="px-2 py-1.5 font-bold text-slate-700 uppercase">Customer</th>
                                    <th className="px-2 py-1.5 font-bold text-slate-700 uppercase text-right">Base Amount</th>
                                    <th className="px-2 py-1.5 font-bold text-slate-700 uppercase text-right">VAT (7%)</th>
                                    <th className="px-2 py-1.5 font-bold text-slate-700 uppercase text-right">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {filteredData?.filter(item => item.type === 'sales').length > 0 ? (
                                    filteredData?.filter(item => item.type === 'sales')?.map((item, i) => (
                                      <tr key={i}>
                                        <td className="px-2 py-1.5 font-medium">{formatDate(item.date)}</td>
                                        <td className="px-2 py-1.5 font-semibold text-[#111f42]">{item.invoice}</td>
                                        <td className="px-2 py-1.5 font-medium">{item.customer}</td>
                                        <td className="px-2 py-1.5 font-medium text-right">{item.amount?.toLocaleString()}</td>
                                        <td className="px-2 py-1.5 font-bold text-right text-[#E3624A]">{item.vat?.toLocaleString()}</td>
                                        <td className="px-2 py-1.5 font-bold text-right">{item.total?.toLocaleString()}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr><td colSpan={6} className="text-center py-3 text-slate-400 italic">No Sales VAT records for this period.</td></tr>
                                  )}
                                </tbody>
                                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                                  <tr>
                                    <td colSpan={3} className="px-2 py-2 text-right uppercase text-[#E3624A]">Total Sales VAT:</td>
                                    <td className="px-2 py-2 text-right">{filteredData?.filter(i => i.type === 'sales')?.reduce((acc, item) => acc + item.amount, 0)?.toLocaleString()}</td>
                                    <td className="px-2 py-2 text-right text-[#E3624A]">{totalSalesVat?.toLocaleString()}</td>
                                    <td className="px-2 py-2 text-right">{filteredData?.filter(i => i.type === 'sales')?.reduce((acc, item) => acc + item.total, 0)?.toLocaleString()}</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        )}

                        {(vatSubTab === 'all' || vatSubTab === 'purchase') && (
                          <div className="mb-6 break-inside-avoid">
                            <h4 className="font-bold text-[#6b7556] uppercase tracking-widest text-xs mb-2 border-b-2 border-[#6b7556] pb-1.5 flex items-center gap-2">
                              <Receipt size={14} /> Purchase VAT (Input Tax) / รายงานภาษีซื้อ
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-[10px] border-b border-slate-200">
                                <thead className="bg-slate-50 border-y border-slate-200">
                                  <tr>
                                    <th className="px-2 py-1.5 font-bold text-slate-700 uppercase">Date</th>
                                    <th className="px-2 py-1.5 font-bold text-slate-700 uppercase">Inv No.</th>
                                    <th className="px-2 py-1.5 font-bold text-slate-700 uppercase">Vendor</th>
                                    <th className="px-2 py-1.5 font-bold text-slate-700 uppercase text-right">Base Amount</th>
                                    <th className="px-2 py-1.5 font-bold text-slate-700 uppercase text-right">VAT (7%)</th>
                                    <th className="px-2 py-1.5 font-bold text-slate-700 uppercase text-right">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {filteredData?.filter(item => item.type === 'purchase').length > 0 ? (
                                    filteredData?.filter(item => item.type === 'purchase')?.map((item, i) => (
                                      <tr key={i}>
                                        <td className="px-2 py-1.5 font-medium">{formatDate(item.date)}</td>
                                        <td className="px-2 py-1.5 font-semibold text-[#111f42]">{item.invoice}</td>
                                        <td className="px-2 py-1.5 font-medium">{item.customer}</td>
                                        <td className="px-2 py-1.5 font-medium text-right">{item.amount?.toLocaleString()}</td>
                                        <td className="px-2 py-1.5 font-bold text-right text-[#6b7556]">{item.vat?.toLocaleString()}</td>
                                        <td className="px-2 py-1.5 font-bold text-right">{item.total?.toLocaleString()}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr><td colSpan={6} className="text-center py-3 text-slate-400 italic">No Purchase VAT records for this period.</td></tr>
                                  )}
                                </tbody>
                                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                                  <tr>
                                    <td colSpan={3} className="px-2 py-2 text-right uppercase text-[#6b7556]">Total Purchase VAT:</td>
                                    <td className="px-2 py-2 text-right">{filteredData?.filter(i => i.type === 'purchase')?.reduce((acc, item) => acc + item.amount, 0)?.toLocaleString()}</td>
                                    <td className="px-2 py-2 text-right text-[#6b7556]">{totalPurchaseVat?.toLocaleString()}</td>
                                    <td className="px-2 py-2 text-right">{filteredData?.filter(i => i.type === 'purchase')?.reduce((acc, item) => acc + item.total, 0)?.toLocaleString()}</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border border-slate-200 p-4 rounded-lg bg-white mt-auto break-inside-avoid">
                        <h4 className="font-bold text-[#111f42] mb-4 uppercase tracking-widest text-xs border-b pb-2">VAT Return Summary</h4>
                        <div className="grid grid-cols-12 gap-3 text-[10px] font-bold text-center mb-2 text-slate-500">
                          <div className="col-span-8 text-left">Description</div>
                          <div className="col-span-2">Amount (THB)</div>
                          <div className="col-span-2">VAT Amount (THB)</div>
                        </div>
                        <div className="grid grid-cols-12 gap-3 items-stretch mb-2">
                          <div className="col-span-8 bg-[#637d6e] text-white px-3 py-2 flex items-center font-medium rounded-sm">
                            <span className="mr-3 font-bold opacity-70">-1</span> Total Sales (Output Tax)
                          </div>
                          <div className="col-span-2 border border-slate-300 px-3 py-2 text-right bg-white flex items-center justify-end font-bold rounded-sm">
                             {filteredData?.filter(i => i.type === 'sales')?.reduce((a,b)=>a+b.amount,0)?.toLocaleString()}
                          </div>
                          <div className="col-span-2 bg-[#c59c47] text-white px-3 py-2 text-right font-bold shadow-sm flex items-center justify-end rounded-sm">
                             {totalSalesVat?.toLocaleString()}
                          </div>
                        </div>
                        <div className="grid grid-cols-12 gap-3 items-stretch mb-4">
                          <div className="col-span-8 bg-[#eaddcd] text-slate-800 px-3 py-2 flex items-center font-medium rounded-sm">
                            <span className="mr-3 font-bold opacity-50">-2</span> Total Purchases (Input Tax)
                          </div>
                          <div className="col-span-2 border border-slate-300 px-3 py-2 text-right bg-white flex items-center justify-end font-bold rounded-sm">
                             {filteredData?.filter(i => i.type === 'purchase')?.reduce((a,b)=>a+b.amount,0)?.toLocaleString()}
                          </div>
                          <div className="col-span-2 border border-slate-300 px-3 py-2 text-right bg-white text-[#b22026] font-bold flex items-center justify-end rounded-sm">
                             {totalPurchaseVat?.toLocaleString()}
                          </div>
                        </div>
                        <div className="grid grid-cols-12 gap-3 items-stretch mt-3">
                          <div className="col-span-10 text-right font-bold px-3 py-2 text-slate-700 flex items-center justify-end uppercase text-[10px]">
                            Net VAT due (or claim)
                          </div>
                          <div className="col-span-2 bg-[#c59c47] text-white px-3 py-2 text-right font-black text-xs shadow-sm flex items-center justify-end rounded-sm">
                            ฿{Math.abs(totalSalesVat - totalPurchaseVat)?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl no-print">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors uppercase tracking-wider">Cancel</button>
                    <button 
                      onClick={onConfirm} 
                      className={`px-6 py-2.5 rounded-lg font-semibold text-white shadow-md hover:opacity-90 transition-all uppercase tracking-wider flex items-center gap-2 ${previewModal === 'print' ? 'bg-[#ab8a3b]' : 'bg-[#7397a8]'}`}
                    >
                      {previewModal === 'print' ? <Printer size={16}/> : <Download size={16}/>} Confirm {previewModal === 'print' ? 'Print' : 'Export'}
                    </button>
                  </div>
                </div>
              </DraggableWrapper>

    </div>
  );
};

export default VatPreviewModal;
