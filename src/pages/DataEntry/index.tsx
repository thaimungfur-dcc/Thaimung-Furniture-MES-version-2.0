import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShoppingCart, 
  Wallet, 
  Factory, 
  Landmark, 
  ChevronRight, 
  Save,
  CheckCircle2,
  RefreshCw,
  Calculator,
  Database,
  AlertCircle,
  HelpCircle,
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useMasterData } from '../../context/MasterDataContext';
import { clsx } from 'clsx';
import { PageHeader } from '../../components/shared/PageHeader';
import { DraggableWrapper } from "../../components/shared/DraggableWrapper";

// Utility function to convert HEX to RGBA for dynamic background opacity
const hexToRgba = (hex: string, opacity: number) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function MasterDataEntry() {
  const { addInvoice } = useMasterData();
  const [entryType, setEntryType] = useState('sales'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Generic Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    docNo: '',
    entity: '', // Customer / Vendor / Employee
    amount: '',
    taxType: 'Vat Exclude', // Vat Exclude, Vat Include, No Vat
    category: '', // Expense Category, Product
    creditTerm: 30,
    department: 'Central'
  });

  // Reset form when changing type
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      docNo: '',
      entity: '',
      amount: '',
      category: entryType === 'expense' ? 'Raw Materials' : entryType === 'mfg' ? 'Product A' : '',
    }));
  }, [entryType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto Calculation Logic for UI Feedback
  const calculateTax = () => {
    const amt = parseFloat(formData.amount) || 0;
    if (formData.taxType === 'Vat Exclude') return { base: amt, vat: amt * 0.07, total: amt * 1.07 };
    if (formData.taxType === 'Vat Include') return { base: amt / 1.07, vat: amt - (amt / 1.07), total: amt };
    return { base: amt, vat: 0, total: amt };
  };
  const taxData = calculateTax();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (entryType === 'sales') {
        const issueDate = new Date(formData.date);
        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + Number(formData.creditTerm));
        
        const amount = parseFloat(formData.amount) || 0;
        
        await addInvoice({
          id: Date.now().toString(),
          issueDate: issueDate.toISOString(),
          dueDate: dueDate.toISOString(),
          invNo: formData.docNo || `INV-${Date.now().toString().slice(-6)}`,
          customer: formData.entity || 'Unknown Customer',
          creditTerm: Number(formData.creditTerm),
          risk: 'Low', // Default
          amount: taxData.total,
          paid: 0,
          balance: taxData.total,
          status: 'Unpaid',
          isBadDebt: false
        });
      }
      
      // Simulate API Call & Data Broadcasting to 16 modules
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true);
        
        // Auto hide success message
        setTimeout(() => {
          setShowSuccess(false);
          setFormData(prev => ({ ...prev, docNo: '', entity: '', amount: '' })); // Clear some fields
        }, 3000);
      }, 500);
    } catch (error) {
      console.error("Error submitting data:", error);
      setIsSubmitting(false);
    }
  };

  // Transaction Types Definition with Hex Colors
  const txTypes = [
    { id: 'sales', icon: ShoppingCart, title: 'ออกอินวอยซ์ขาย (Sales)', desc: 'บันทึกรายได้, ตั้งลูกหนี้ (AR)', hexColor: '#496ca8', textActive: 'text-white', bgActive: 'bg-[#223f59]' },
    { id: 'expense', icon: Building2, title: 'บันทึกซื้อ/ค่าใช้จ่าย (Expense)', desc: 'ตั้งเจ้าหนี้ (AP), ค่าใช้จ่ายบริหาร (ACA)', hexColor: '#ce5a43', textActive: 'text-white', bgActive: 'bg-[#933b5b]' },
    { id: 'petty_cash', icon: Wallet, title: 'เบิกเงินสดย่อย (Petty Cash)', desc: 'เบิกจ่ายรายวัน, ควบคุมงบ', hexColor: '#d9b343', textActive: 'text-[#223f59]', bgActive: 'bg-[#f2b33d]' },
    { id: 'mfg', icon: Factory, title: 'สั่งผลิตสินค้า (Manufacturing)', desc: 'บันทึกต้นทุนผลิต (CMP)', hexColor: '#3c5d7d', textActive: 'text-white', bgActive: 'bg-[#223f59]' },
    { id: 'bank', icon: Landmark, title: 'รับ/จ่าย ธนาคาร (Bank Rec)', desc: 'ตัดหนี้, กระทบยอด (Bank Rec)', hexColor: '#7fa85a', textActive: 'text-white', bgActive: 'bg-[#5c803f]' },
  ];

  const activeTx = txTypes.find(t => t.id === entryType) || txTypes[0];

  // Determine which sub-modules get updated based on Entry Type
  const getRoutingTags = () => {
    switch (entryType) {
      case 'sales': return [
        { label: 'AR Database', style: 'bg-blue-50 text-blue-700 border-blue-200' },
        { label: 'TAX (Output)', style: 'bg-rose-50 text-rose-700 border-rose-200' },
        { label: 'Cash Flow (Forecast)', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
      ];
      case 'expense': return [
        { label: 'AP Database', style: 'bg-orange-50 text-orange-700 border-orange-200' },
        { label: 'TAX (Input)', style: 'bg-rose-50 text-rose-700 border-rose-200' },
        { label: 'Cash Flow (Forecast)', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        { label: 'ACA (Admin Cost)', style: 'bg-purple-50 text-purple-700 border-purple-200' },
        { label: 'CMP (Raw Material)', style: 'bg-teal-50 text-teal-700 border-teal-200' }
      ];
      case 'petty_cash': return [
        { label: 'Petty Cash DB', style: 'bg-amber-50 text-amber-700 border-amber-200' },
        { label: 'ACA Database', style: 'bg-purple-50 text-purple-700 border-purple-200' }
      ];
      case 'mfg': return [
        { label: 'CMP Database', style: 'bg-teal-50 text-teal-700 border-teal-200' }
      ];
      case 'bank': return [
        { label: 'Bank Rec DB', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
        { label: 'Cash Flow (Actual)', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        { label: 'AR / AP (Clear Debt)', style: 'bg-slate-100 text-slate-700 border-slate-300' }
      ];
      default: return [];
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade { animation: fadeIn 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
      `}</style>
      
      <div className="flex flex-col flex-1 pb-10 animate-fade-in-up">
        <PageHeader 
          Icon={Database}
          title="MASTER DATA ENTRY"
          subtitle="ศูนย์กลางบันทึกข้อมูล (Single Point of Entry)"
        />

        <main className="flex-1 relative z-10 pt-4 flex flex-col gap-6 no-print w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            
            {/* LEFT COLUMN: Type Selector */}
            <div className="lg:col-span-4 space-y-3 flex flex-col h-full">
              <h2 className="text-[10px] font-black text-[#7693a6] uppercase tracking-widest px-1 mb-2">1. Select Transaction Type</h2>
              
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
                {txTypes?.map((tx) => {
                  const isSelected = entryType === tx.id;
                  const Icon = tx.icon;
                  return (
                    <button
                      key={tx.id}
                      onClick={() => setEntryType(tx.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group flex items-center gap-4
                        ${isSelected 
                          ? `${tx.bgActive} border-transparent shadow-md transform -translate-y-0.5` 
                          : `bg-white/80 backdrop-blur-md border-white shadow-sm hover:bg-white hover:-translate-y-0.5 hover:shadow-md`
                        }`}
                    >
                      <div 
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-inner ${isSelected ? 'bg-white/20 text-white' : ''}`}
                        style={!isSelected ? { backgroundColor: hexToRgba(tx.hexColor, 0.1), color: tx.hexColor } : {}}
                      >
                        <Icon size={20} className={isSelected ? 'text-white' : ''} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-black text-sm tracking-tight ${isSelected ? tx.textActive : 'text-[#223f59]'}`}>{tx.title}</h3>
                        <p className={`text-[10px] mt-1 font-black uppercase tracking-widest ${isSelected ? 'text-white/80' : 'text-[#7693a6]'}`}>{tx.desc}</p>
                      </div>
                      {isSelected && <ChevronRight size={18} className={tx.textActive} />}
                    </button>
                  );
                })}

                {/* Data Routing Information Box */}
                <div className="mt-6 bg-white/60 backdrop-blur-md border border-white p-5 rounded-none animate-fade shadow-sm">
                  <h4 className="text-[10px] font-black text-[#223f59] uppercase tracking-widest mb-3 flex items-center gap-2">
                    <RefreshCw size={14} className="text-[#496ca8]" /> Auto-Routing Flow:
                  </h4>
                  <div className="flex flex-wrap gap-2 text-white">
                    {getRoutingTags()?.map((tag, i) => (
                      <span key={i} className={`px-2 py-1 rounded-none text-[9px] font-black uppercase tracking-[0.2em] border brightness-90 ${tag.style}`}>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#7693a6] font-black mt-3 leading-relaxed uppercase tracking-widest">
                    * ข้อมูลจะถูกบันทึกเพียง 1 ครั้ง และกระจายไปยังฐานข้อมูล และ แดชบอร์ด ที่เกี่ยวข้องทั้งหมดโดยอัตโนมัติ เพื่อลดความซ้ำซ้อน
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Dynamic Input Form */}
            <div className="lg:col-span-8 flex flex-col h-full">
              <h2 className="text-[10px] font-black text-[#7693a6] uppercase tracking-widest px-1 mb-2">2. Enter Transaction Details</h2>
              
              <div 
                className="backdrop-blur-xl border border-white p-6 md:p-8 rounded-2xl shadow-sm animate-fade relative overflow-y-auto custom-scrollbar flex-1 mb-6 transition-colors duration-500"
                style={{ backgroundColor: hexToRgba(activeTx.hexColor, 0.15) }}
              >
                {/* Success Overlay */}
                {showSuccess && (
                  <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center animate-fade rounded-2xl">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner border-[4px] border-white">
                      <CheckCircle2 size={48} className="text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-black text-[#223f59] tracking-[0.2em] uppercase mb-2">Data Saved!</h3>
                    <p className="text-[11px] font-black text-[#7693a6] text-center max-w-sm uppercase tracking-widest">Successfully broadcasted to selected modules securely.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Header info based on type */}
                  <div className="border-b border-black/5 mb-2">
                     <h3 className="text-lg font-black text-[#223f59] uppercase tracking-widest flex items-center gap-2">
                       {activeTx.title}
                     </h3>
                  </div>

                  {/* Common Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#223f59] uppercase tracking-widest">Document Date <span className="text-[#ce5a43]">*</span></label>
                      <input 
                        type="date" name="date" required
                        value={formData.date} onChange={handleInputChange}
                        className="w-full bg-white/80 border border-white rounded-none py-3 text-sm font-black text-[#223f59] focus:border-[#496ca8] focus:bg-white outline-none transition-colors shadow-sm font-mono uppercase tracking-widest"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#223f59] uppercase tracking-widest">
                        {entryType === 'sales' ? 'Invoice No.' : entryType === 'expense' ? 'Bill / PO No.' : entryType === 'petty_cash' ? 'PCV No.' : entryType === 'mfg' ? 'Work Order No.' : 'Ref No.'} <span className="text-[#ce5a43]">*</span>
                      </label>
                      <input 
                        type="text" name="docNo" required placeholder="Auto-generated if left blank"
                        value={formData.docNo} onChange={handleInputChange}
                        className="w-full bg-white/80 border border-white rounded-none py-3 text-sm font-black text-[#223f59] focus:border-[#496ca8] focus:bg-white outline-none transition-colors shadow-sm placeholder:text-slate-400 placeholder:font-black uppercase tracking-widest font-mono"
                      />
                    </div>
                  </div>

                  {/* Entity Field */}
                  {(entryType === 'sales' || entryType === 'expense' || entryType === 'petty_cash' || entryType === 'bank') && (
                    <div className="space-y-1.5 animate-fade">
                      <label className="text-[10px] font-black text-[#223f59] uppercase tracking-widest">
                        {entryType === 'sales' ? 'Customer Name' : entryType === 'expense' ? 'Vendor / Supplier' : entryType === 'petty_cash' ? 'Employee Name' : 'Payee / Payer'} <span className="text-[#ce5a43]">*</span>
                      </label>
                      <input 
                        type="text" name="entity" required placeholder="Type name..."
                        value={formData.entity} onChange={handleInputChange}
                        className="w-full bg-white/80 border border-white rounded-none py-3 text-sm font-black text-[#223f59] focus:border-[#496ca8] focus:bg-white outline-none transition-colors shadow-sm placeholder:text-slate-400 placeholder:font-black uppercase tracking-widest"
                      />
                    </div>
                  )}

                  {/* Category Field */}
                  {(entryType === 'expense' || entryType === 'petty_cash' || entryType === 'mfg') && (
                    <div className="space-y-1.5 animate-fade">
                      <label className="text-[10px] font-black text-[#223f59] uppercase tracking-widest">
                        {entryType === 'mfg' ? 'Product to Manufacture' : 'Expense Category'} <span className="text-[#ce5a43]">*</span>
                      </label>
                      <select 
                        name="category" required
                        value={formData.category} onChange={handleInputChange}
                        className="w-full bg-white/80 border border-white rounded-none py-3 text-sm font-black text-[#223f59] focus:border-[#496ca8] focus:bg-white outline-none transition-colors shadow-sm uppercase tracking-widest"
                      >
                        {entryType === 'expense' && (
                          <>
                            <option value="Raw Materials">Raw Materials (CMP, AP)</option>
                            <option value="Overhead">Factory Overhead (CMP, AP)</option>
                            <option value="Admin Office">Admin / Office Supplies (ACA, AP)</option>
                            <option value="IT Software">IT & Software (ACA, AP)</option>
                            <option value="Payroll">Payroll</option>
                          </>
                        )}
                        {entryType === 'petty_cash' && (
                          <>
                            <option value="Travel">Travel & Transport</option>
                            <option value="Meals">Meals & Entertainment</option>
                            <option value="Supplies">Office Supplies</option>
                            <option value="Postage">Postage & Delivery</option>
                          </>
                        )}
                        {entryType === 'mfg' && (
                          <>
                            <option value="Product A">Smart TV Box</option>
                            <option value="Product B">Eco LED Panel</option>
                            <option value="Product C">Sound Bar</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}

                  {/* Finance / Amounts Section */}
                  <div className="bg-white/40 p-5 rounded-none border border-white shadow-sm">
                    <h3 className="text-[10px] font-black text-[#223f59] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Calculator size={14} className="text-[#ce5a43]" /> Financial Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#223f59] uppercase tracking-widest">Input Amount (THB) <span className="text-[#ce5a43]">*</span></label>
                        <div className="relative">
                          <span className="absolute left-4 top-3 text-[#7693a6] font-black">฿</span>
                          <input 
                            type="number" name="amount" required step="0.01" placeholder="0.00"
                            value={formData.amount} onChange={handleInputChange}
                            className="w-full bg-white border border-white rounded-none py-3 pl-10 text-lg font-black text-[#223f59] focus:border-[#496ca8] outline-none transition-colors shadow-sm font-mono tracking-tighter"
                          />
                        </div>
                      </div>

                      {(entryType === 'sales' || entryType === 'expense') && (
                        <div className="space-y-1.5 animate-fade">
                          <label className="text-[10px] font-black text-[#223f59] uppercase tracking-widest">VAT Calculation</label>
                          <select 
                            name="taxType"
                            value={formData.taxType} onChange={handleInputChange}
                            className="w-full bg-white/90 border border-white rounded-none py-3 text-sm font-black text-[#223f59] focus:border-[#496ca8] outline-none transition-colors shadow-sm uppercase tracking-widest"
                          >
                            <option value="Vat Exclude">VAT Exclude (+7% On top)</option>
                            <option value="Vat Include">VAT Include (Included in amount)</option>
                            <option value="No Vat">No VAT (0%)</option>
                          </select>
                        </div>
                      )}

                      {(entryType === 'sales' || entryType === 'expense') && (
                        <div className="space-y-1.5 animate-fade md:col-span-2">
                          <label className="text-[10px] font-black text-[#223f59] uppercase tracking-widest">Credit Term (Days)</label>
                          <input 
                            type="number" name="creditTerm" required
                            value={formData.creditTerm} onChange={handleInputChange}
                            className="w-full md:w-1/2 bg-white/90 border border-white rounded-none py-3 text-sm font-black text-[#223f59] focus:border-[#496ca8] outline-none transition-colors shadow-sm font-mono tracking-widest"
                          />
                        </div>
                      )}
                    </div>

                    {/* Auto Breakdown Preview (Sales & Expense) */}
                    {(entryType === 'sales' || entryType === 'expense') && formData.amount && (
                      <div className="mt-5 p-4 bg-white border border-white rounded-none flex items-center justify-between animate-fade shadow-sm">
                        <div>
                          <p className="text-[9px] font-black text-[#7693a6] uppercase tracking-[0.2em]">Base Amount</p>
                          <p className="font-mono font-black text-[#223f59] text-sm">฿{taxData.base?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-black text-[#7693a6] uppercase tracking-[0.2em]">VAT (7%)</p>
                          <p className="font-mono text-[#ce5a43] font-black text-sm">+ ฿{taxData.vat?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-[#7693a6] uppercase tracking-[0.2em]">Net Total (AR/AP)</p>
                          <p className="font-mono text-xl font-black text-[#496ca8]">฿{taxData.total?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-[#223f59] flex items-center gap-1.5 font-black uppercase tracking-widest">
                      <AlertCircle size={12} className="text-[#d9b343]"/> Review amounts before saving.
                    </p>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full sm:w-auto py-3.5 bg-[#223f59] hover:bg-[#1a3045] text-white rounded-none font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                      {isSubmitting ? 'Processing...' : 'Save & Broadcast Data'}
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </div>
        </main>

        {/* User Guide Drawer */}
        {isGuideOpen && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            
                      <DraggableWrapper>
                            <div className="absolute inset-0 bg-[#223149]/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsGuideOpen(false)}></div>
                          </DraggableWrapper>

            <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/20 rounded-none">
              <div className="py-5 flex justify-between items-center bg-[#223149] text-white shrink-0 shadow-md">
                <h2 className="text-base font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <HelpCircle size={20} className="text-[#df8a5d]" /> MASTER GUIDE
                </h2>
                <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-none transition-colors border border-transparent hover:border-white/10"><X size={20} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f5f0e9] text-[13px] text-[#223149] space-y-6">
                <div>
                  <h3 className="text-sm font-black text-[#223149] border-b-2 border-[#ce5a43]/30 pb-2 mb-3 flex items-center gap-2 uppercase tracking-wide">
                    <ShieldCheck size={16} className="text-[#7fa85a]"/> 1. Single Point of Entry
                  </h3>
                  <p className="leading-relaxed font-black uppercase text-[10px] tracking-widest opacity-80">
                    หน้านี้คือศูนย์กลางการบันทึกข้อมูลเพียงจุดเดียวของทั้ง 16 โมดูลในระบบ บัญชีและบริหารการเงิน 
                    <span className="font-bold text-[#ce5a43]"> ห้ามบันทึกข้อมูลซ้ำในโมดูลย่อย </span> 
                    เพื่อป้องกันตัวเลขไม่ตรงกัน
                  </p>
                </div>

                <div className="bg-white/80 p-4 rounded-none border border-white shadow-sm">
                  <h3 className="text-[12px] font-black text-[#223149] mb-3 uppercase flex items-center gap-2 tracking-widest">
                    <Zap size={14} className="text-[#d9b343]"/> Broadcasting
                  </h3>
                  <ul className="space-y-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-none bg-blue-500 mt-1.5 shrink-0"></div>
                      <span><strong>Sales:</strong> วิ่งไปที่ AR Database, TAX (Output), และ Cash Flow Forecast (Inflow)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-none bg-rose-500 mt-1.5 shrink-0"></div>
                      <span><strong>Expense:</strong> วิ่งไปที่ AP Database, TAX (Input), Cash Flow (Outflow) และ ACA/CMP ตามหมวดหมู่</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-none bg-amber-500 mt-1.5 shrink-0"></div>
                      <span><strong>Petty Cash:</strong> วิ่งไปที่ Petty Cash Database และ ACA (Admin Cost)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#223149] border-b-2 border-[#ce5a43]/30 pb-2 mb-3 flex items-center gap-2 uppercase tracking-wide">
                    <Calculator size={16} className="text-[#496ca8]"/> 2. Auto Tax
                  </h3>
                  <p className="leading-relaxed font-black uppercase text-[10px] tracking-widest opacity-80">
                    เมื่อกรอกจำนวนเงินและเลือกประเภท VAT ระบบจะแยกยอด ฐานภาษี และ VAT 7% ให้ทันที 
                    กรุณาตรวจสอบยอด Net Total ให้ตรงกับเอกสารจริงก่อนกดบันทึก
                  </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-none border border-emerald-100 text-emerald-800 text-[10px] font-black italic leading-relaxed uppercase tracking-widest">
                  * หมายเหตุ: หากต้องการแก้ไขรายการที่บันทึกไปแล้ว ให้ใช้เมนู Search ในหน้านี้เพื่อค้นหา Ref No. และทำการแก้ไขที่นี่ที่เดียว ระบบจะอัปเดตโมดูลอื่นๆ ให้ทั้งหมด
                </div>
              </div>

              <div className="p-5 bg-white border-t border-slate-100 flex justify-end shrink-0 shadow-inner">
                <button onClick={() => setIsGuideOpen(false)} className="py-2.5 rounded-none font-black bg-[#223149] text-white hover:opacity-90 transition-all uppercase tracking-widest">
                  รับทราบ (Close)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
