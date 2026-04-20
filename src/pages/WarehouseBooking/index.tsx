import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    PackageCheck, Search, Calendar, Clock, FileBarChart, HelpCircle, 
    Eye, Loader2, CheckCircle2, Tag, Download, PowerOff, Package as BoxIcon, Printer
} from 'lucide-react';

import NotificationModal from './components/NotificationModal';
import KpiCard from './components/KpiCard';
import PaginationControls from './components/PaginationControls';
import AllocationModal from './components/AllocationModal';
import TagPrintModal from './components/TagPrintModal';
import ReportPreviewModal from './components/ReportPreviewModal';
import DetailPreviewModal from './components/DetailPreviewModal';
import GuideDrawer from './components/GuideDrawer';

// --- Helper Functions ---
const formatNum = (v: any) => (Number(v) || 0).toLocaleString();

export default function WarehouseBooking() {
    // --- Constants ---
    const statuses = ['Not Started', 'In Progress', 'Completed', 'All'];

    // --- State Management ---
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'report'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('2026-03');
    
    // Feature Modals
    const [showModal, setShowModal] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [notif, setNotif] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'error' | 'warning' | 'info' });
    
    // Tag Feature States
    const [showTagModal, setShowTagModal] = useState(false);
    const [printFormat, setPrintFormat] = useState('A5');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [barcodeUrl, setBarcodeUrl] = useState('');

    // Report & Preview State
    const [reportDateRange, setReportDateRange] = useState({ start: '', end: '' });
    const [reportData, setReportData] = useState<any[]>([]);
    const [showReportPreview, setShowReportPreview] = useState(false);
    const [showBookingPreview, setShowBookingPreview] = useState(false);

    // Data State
    const [bookings, setBookings] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Form State for Allocation
    const [form, setForm] = useState({
        date: '', qty: 0, location: '', warehouseName: '', lotNo: '', remark: '', refNo: '', itemName: ''
    });

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // --- Script Loader for QR/Barcode ---
    useEffect(() => {
        const loadScript = (src: string) => {
            return new Promise<void>((resolve) => {
                if (document.querySelector(`script[src="${src}"]`)) return resolve();
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve();
                document.head.appendChild(script);
            });
        };
        Promise.all([
            loadScript('https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js'),
            loadScript('https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js')
        ]);
    }, []);

    // --- Mock Data Initialization ---
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setBookings([
                { id: 1, bookingId: 'BK2603-001', soRef: 'SO-2026-001', date: '2026-03-10', customer: 'HomePro (Public Company)', sku: 'FG-LD-001', productName: 'ราวตากผ้าสแตนเลส (รุ่นพับได้)', qty: 50, booked: 20, status: 'In Progress', location: 'WH-A-01', lot: 'LOT-260114', unit: 'Set' },
                { id: 2, bookingId: 'BK2603-002', soRef: 'SO-2026-001', date: '2026-03-10', customer: 'HomePro (Public Company)', sku: 'FG-LD-002', productName: 'ราวแขวนผ้าบาร์คู่ (ล้อเลื่อน)', qty: 30, booked: 0, status: 'Not Started', location: 'WH-A-02', lot: 'LOT-260210', unit: 'Set' },
                { id: 3, bookingId: 'BK2603-003', soRef: 'SO-2026-002', date: '2026-03-12', customer: 'Index Living Mall', sku: 'FG-OF-001', productName: 'เก้าอี้จัดเลี้ยง (เบาะนวม)', qty: 100, booked: 100, status: 'Completed', location: 'WH-B-05', lot: 'LOT-260301', unit: 'Pcs' },
                { id: 4, bookingId: 'BK2603-004', soRef: 'SO-2026-003', date: '2026-03-15', customer: 'Origin Condo Project', sku: 'FG-BD-001', productName: 'ชุดเครื่องนอนครบเซ็ต', qty: 20, booked: 20, status: 'Completed', location: 'WH-C-10', lot: 'LOT-260120', unit: 'Set' },
                { id: 5, bookingId: 'BK2603-005', soRef: 'SO-2026-004', date: '2026-03-16', customer: 'Siam Furniture Dealer', sku: 'FG-LV-001', productName: 'โต๊ะญี่ปุ่นไม้สักทอง', qty: 15, booked: 5, status: 'In Progress', location: 'WH-D-01', lot: 'LOT-260228', unit: 'Pcs' },
            ]);
            setLoading(false);
        }, 500);
    }, [selectedMonth]);

    // Generate Visuals for Tag
    useEffect(() => {
        if (showTagModal && selectedItem) {
            const dataToEncode = String(selectedItem.bookingId);
            if ((window as any).QRCode) {
                (window as any).QRCode.toDataURL(dataToEncode, { margin: 1, width: 150 })
                    .then((url: string) => setQrCodeUrl(url))
                    .catch((err: any) => console.error(err));
            }
            if ((window as any).JsBarcode) {
                const canvas = document.createElement('canvas');
                (window as any).JsBarcode(canvas, dataToEncode, {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 2,
                    height: 40,
                    displayValue: true,
                    fontSize: 12,
                    margin: 0
                });
                setBarcodeUrl(canvas.toDataURL("image/png"));
            }
        }
    }, [showTagModal, selectedItem]);

    // --- Logic & Filtering ---
    const filteredBookings = useMemo(() => {
        let res = bookings;
        if (statusFilter !== 'All') res = res.filter(b => b.status === statusFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(b => b.bookingId.toLowerCase().includes(q) || b.soRef.toLowerCase().includes(q) || b.customer.toLowerCase().includes(q) || b.sku.toLowerCase().includes(q));
        }
        return res;
    }, [bookings, statusFilter, searchQuery]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBookings.slice(start, start + itemsPerPage);
    }, [filteredBookings, currentPage, itemsPerPage]);

    const stats = useMemo(() => ({
        totalReserved: bookings.reduce((acc, b) => acc + b.qty, 0),
        notStarted: bookings.filter(b => b.status === 'Not Started').length,
        inProgress: bookings.filter(b => b.status === 'In Progress').length,
        completed: bookings.filter(b => b.status === 'Completed').length
    }), [bookings]);

    // --- Handlers ---
    const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => setNotif({ isOpen: true, title, message, type });

    const openBookingModal = (item: any) => {
        setSelectedItem(item);
        setForm({
            date: new Date().toISOString().slice(0, 16),
            qty: Math.max(0, item.qty - item.booked),
            location: item.location || '',
            warehouseName: 'FG',
            lotNo: item.lot || `L${Date.now().toString().slice(-6)}`,
            remark: '',
            refNo: '',
            itemName: ''
        });
        setShowModal(true);
    };

    const openTagModal = (item: any) => {
        setSelectedItem(item);
        setShowTagModal(true);
    };

    const handleForceClose = (item: any) => {
        setSelectedItem(item);
        setNotif({
            isOpen: true,
            title: 'Confirm Close',
            message: `ยืนยันการปิดงานการจอง ${item.bookingId} ถึงแม้จะยังไม่ครบจำนวน?`,
            type: 'warning',
            onConfirm: () => {
                setBookings(prev => prev.map(b => b.id === item.id ? { ...b, status: 'Completed' } : b));
                setNotif(prev => ({...prev, isOpen: false}));
                showToast('Success', 'ปิดงานเรียบร้อยแล้ว');
            }
        } as any);
    };

    const submitBooking = (isFinal = false) => {
        if (form.qty <= 0) return showToast('Error', 'กรุณาระบุจำนวนที่ต้องการจอง', 'error');
        const newBooked = selectedItem.booked + Number(form.qty);
        const newStatus = (isFinal || newBooked >= selectedItem.qty) ? 'Completed' : 'In Progress';
        setBookings(prev => prev.map(b => b.id === selectedItem.id ? { ...b, booked: newBooked, status: newStatus } : b));
        setShowModal(false);
        showToast('Success', 'บันทึกการจัดสรรสต็อกเรียบร้อยแล้ว');
    };

    const generateReport = () => {
        if (!reportDateRange.start || !reportDateRange.end) {
            return showToast('Warning', 'กรุณาระบุช่วงวันที่ให้ครบถ้วน', 'warning');
        }
        const filtered = bookings.filter(b => b.date >= reportDateRange.start && b.date <= reportDateRange.end);
        setReportData(filtered);
    };

    const getStatusClass = (status: string) => {
        switch(status) {
            case 'Not Started': return 'bg-slate-100 text-slate-500 border-slate-200';
            case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            default: return 'bg-slate-50 text-slate-400 border-slate-200';
        }
    };

    const getProgressColor = (status: string) => {
        if (status === 'Completed') return '#10b981';
        if (status === 'In Progress') return '#3b82f6';
        return '#cbd5e1';
    };

    const executePrintTag = () => {
        const win = window.open('', '_blank');
        const printContent = document.getElementById('tag-print-area')?.innerHTML || '';
        if (win) {
            win.document.write(`
                <html><head><title>Print Tag</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@800&family=Noto+Sans+Thai:wght@400;700;900&display=swap');
                    body { margin: 0; padding: 0; font-family: 'Noto Sans Thai', sans-serif; -webkit-print-color-adjust: exact; background-color: white; }
                    @page { size: ${printFormat === 'A5' ? 'A5 landscape' : 'A4 portrait'}; margin: 0; }
                    .print-wrapper { width: 210mm; height: ${printFormat === 'A5' ? '148.5mm' : '297mm'}; padding: 10mm; box-sizing: border-box; }
                </style>
                </head><body>
                <div class="print-wrapper">${printContent}</div>
                <script>window.onload = function() { setTimeout(() => { window.print(); window.close(); }, 1000); };</script>
                </body></html>
            `);
            win.document.close();
        }
    };

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-[#F9F7F6] font-sans">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800;900&family=Noto+Sans+Thai:wght@300;400;500;600;700;900&display=swap');
                * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
                .master-custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .master-custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
                
                .minimal-th { 
                    font-size: 11px !important; text-transform: uppercase; letter-spacing: 0.1em; color: #FFFFFF; 
                    padding: 14px 16px; font-weight: 800; background-color: #111f42 !important; 
                    border-bottom: 2.5px solid #ab8a3b !important; white-space: nowrap; cursor: pointer; transition: background-color 0.2s;
                }
                .minimal-th:hover { background-color: #1e346b !important; }
                .minimal-td { padding: 12px 16px; vertical-align: middle; color: #111f42; font-size: 12.5px !important; font-weight: 500; border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
                tr:hover .minimal-td { background-color: rgba(171, 138, 59, 0.05); }
                
                .badge { display: inline-flex; align-items: center; padding: 0.2rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 10px; border: 1px solid transparent; text-transform: uppercase; }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                .modal-overlay { position: fixed; inset: 0; background: rgba(17, 31, 66, 0.6); backdrop-filter: blur(4px); z-index: 50000; display: flex; justify-content: center; align-items: center; padding: 1rem; }
                .input-primary { width: 100%; background: white; border: 1px solid #E2E8F0; border-radius: 0.5rem; padding: 10px 14px; font-size: 13px; color: #111f42; outline: none; transition: border 0.2s; font-weight: bold; }
                .input-primary:focus { border-color: #ab8a3b; box-shadow: 0 0 0 3px rgba(171, 138, 59, 0.08); }
            `}</style>

            {/* Header */}
            <header className="px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 z-10 bg-[#F9F7F6] no-print border-b border-slate-200">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl shadow-sm border border-slate-200 relative shrink-0">
                        <PackageCheck size={24} className="text-[#111f42]" strokeWidth={2} />
                        <div className="absolute bottom-[10px] right-[10px] w-1.5 h-1.5 bg-[#ab8a3b] rounded-full"></div>
                    </div>
                    <div>
                        <h1 className="text-2xl tracking-tight whitespace-nowrap uppercase leading-none font-mono">
                            <span className="font-light text-[#111f42]">WAREHOUSE</span> <span className="font-black text-[#E3624A]">BOOKING</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-widest opacity-80 font-mono">Stock Reservation Hub</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mr-1 h-10 px-3">
                        <Calendar size={14} className="text-slate-400 mr-2" />
                        <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="text-[12px] font-bold text-[#111f42] outline-none cursor-pointer h-full font-mono bg-transparent" />
                    </div>

                    <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl overflow-hidden h-10 shrink-0">
                        <button onClick={() => {setActiveTab('pending'); setCurrentPage(1);}} className={`px-5 py-1.5 text-[10px] font-black uppercase transition-all rounded-lg flex items-center gap-2 ${activeTab === 'pending' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><Clock size={14}/> PENDING</button>
                        <button onClick={() => {setActiveTab('report'); setCurrentPage(1);}} className={`px-5 py-1.5 text-[10px] font-black uppercase transition-all rounded-lg flex items-center gap-2 ${activeTab === 'report' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><FileBarChart size={14}/> REPORT</button>
                    </div>
                    
                    <button onClick={() => setIsGuideOpen(true)} className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm"><HelpCircle size={20}/></button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto master-custom-scrollbar relative z-10 px-8 pt-2 pb-8 flex flex-col gap-6 no-print">
                {activeTab === 'pending' ? (
                    <div className="flex flex-col gap-6 animate-fade-in-up flex-1 h-full">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0 mt-4">
                            <KpiCard title="Reserved Qty" val={stats.totalReserved} color="#111f42" Icon={BoxIcon} desc="Inventory Allocated" />
                            <KpiCard title="New Orders" val={stats.notStarted} color="#72A09E" Icon={Calendar} desc="Waiting Process" />
                            <KpiCard title="In Progress" val={stats.inProgress} color="#ab8a3b" Icon={Clock} desc="Partial Allocation" />
                            <KpiCard title="Completed" val={stats.completed} color="#10b981" Icon={CheckCircle2} desc="Finished Jobs" />
                        </div>

                        <div className="bg-white border border-slate-200 flex flex-col rounded-none shadow-sm flex-1 min-h-[550px] relative overflow-visible">
                            {/* Toolbar */}
                            <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/50 sticky top-0 z-20">
                                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm shrink-0">
                                        {statuses.map(s => (
                                            <button key={s} onClick={() => {setStatusFilter(s); setCurrentPage(1);}} 
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase ${statusFilter === s ? 'bg-[#111f42] text-[#ab8a3b]' : 'text-slate-500 hover:bg-slate-50'}`}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative w-full lg:w-72 shrink-0 h-10">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Booking, SKU or SO..." className="w-full h-full bg-white border border-slate-200 rounded-xl pl-9 text-[12px] outline-none font-bold focus:border-[#ab8a3b] h-[40px]" />
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="flex-1 overflow-x-auto master-custom-scrollbar">
                                <table className="w-full text-left whitespace-nowrap border-collapse min-w-[1200px]">
                                    <thead className="sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th className="minimal-th">Booking ID</th>
                                            <th className="minimal-th">Customer / SO Ref</th>
                                            <th className="minimal-th">Product (SKU/Name)</th>
                                            <th className="minimal-th text-right">Target</th>
                                            <th className="minimal-th text-center w-48">Allocated</th>
                                            <th className="minimal-th text-center">Status</th>
                                            <th className="minimal-th text-center w-36">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white text-[12px]">
                                        {paginatedData.map(b => (
                                            <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="minimal-td font-black text-[#ab8a3b] font-mono leading-none">{String(b.bookingId)}</td>
                                                <td className="minimal-td">
                                                    <div className="font-bold text-[#111f42] text-[12px]">{String(b.customer)}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono font-bold mt-1 uppercase leading-none">SO: {String(b.soRef)}</div>
                                                </td>
                                                <td className="minimal-td">
                                                    <div className="font-black text-[#111f42] text-[11px] font-mono leading-none">{String(b.sku)}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[200px] mt-1">{String(b.productName)}</div>
                                                </td>
                                                <td className="minimal-td text-right font-black text-[#111f42] font-mono text-[14px]">{formatNum(b.qty)}</td>
                                                <td className="minimal-td text-center w-48">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200 shadow-inner">
                                                            <div className="h-full transition-all duration-700 rounded-full" style={{ width: `${(b.booked/b.qty)*100}%`, backgroundColor: getProgressColor(b.status) }}></div>
                                                        </div>
                                                        <span className="text-[10px] font-mono font-black text-slate-500 leading-none">{formatNum(b.booked)} / {Math.round((b.booked/b.qty)*100)}%</span>
                                                    </div>
                                                </td>
                                                <td className="minimal-td text-center"><span className={`badge ${getStatusClass(b.status)}`}>{String(b.status)}</span></td>
                                                <td className="minimal-td text-center">
                                                    <div className="flex justify-center items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity font-bold">
                                                        <button onClick={() => {setSelectedItem(b); setShowBookingPreview(true);}} className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-lg shadow-sm" title="Preview Detail"><Eye size={14} /></button>
                                                        <button onClick={() => openTagModal(b)} className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-[#ab8a3b] rounded-lg shadow-sm" title="Print Tag"><Tag size={14} /></button>
                                                        {b.status !== 'Completed' && (
                                                            <>
                                                                <button onClick={() => openBookingModal(b)} className="p-1.5 bg-white border border-slate-200 text-[#ab8a3b] hover:text-white hover:bg-[#ab8a3b] rounded-lg shadow-sm" title="Allocate Stock"><Download size={14}/></button>
                                                                {b.status === 'In Progress' && (
                                                                    <button onClick={() => handleForceClose(b)} className="p-1.5 bg-white border border-slate-200 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg shadow-sm" title="Force Close"><PowerOff size={14}/></button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {paginatedData.length === 0 && <tr><td colSpan={7} className="text-center py-24 text-slate-300 italic font-bold">No records found</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                            <PaginationControls totalItems={filteredBookings.length} page={currentPage} rows={itemsPerPage} setPage={setCurrentPage} />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 flex flex-col min-h-[600px] animate-fade-in-up rounded-none shadow-sm relative mt-4">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/50 sticky top-0 z-20">
                            <div className="flex flex-1 items-center gap-4 w-full overflow-x-auto no-scrollbar">
                                <div className="flex items-center gap-3 mr-2 shrink-0">
                                    <div className="w-1.5 h-5 bg-[#ab8a3b] rounded-full shadow-sm"></div>
                                    <h2 className="text-sm font-black text-[#111f42] uppercase tracking-widest leading-none">Booking Report</h2>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">From</label>
                                    <input type="date" value={reportDateRange.start} onChange={(e) => setReportDateRange({...reportDateRange, start: e.target.value})} className="input-primary w-40 h-9 py-0 font-bold" />
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">To</label>
                                    <input type="date" value={reportDateRange.end} onChange={(e) => setReportDateRange({...reportDateRange, end: e.target.value})} className="input-primary w-40 h-9 py-0 font-bold" />
                                </div>
                                <button onClick={generateReport} className="px-6 py-2 bg-[#111f42] text-[#ab8a3b] rounded-lg font-black text-[10px] shadow-md flex items-center gap-2 uppercase tracking-widest hover:brightness-110 transition-all font-mono shrink-0">GENERATE</button>
                            </div>
                            {reportData.length > 0 && (
                                <button onClick={() => setShowReportPreview(true)} className="px-6 py-2 bg-[#ab8a3b] text-white text-[10px] font-black rounded-lg shadow-md uppercase transition-all flex items-center gap-2 tracking-widest font-mono shrink-0 hover:bg-[#917532]">
                                    <Printer size={14} /> PREVIEW & PRINT
                                </button>
                            )}
                        </div>
                        <div className="flex-1 overflow-auto master-custom-scrollbar bg-white">
                            {reportData.length > 0 ? (
                                <table className="w-full text-left whitespace-nowrap border-collapse">
                                    <thead className="sticky top-0 z-10 shadow-sm bg-white">
                                        <tr>
                                            <th className="minimal-th">Booking ID</th>
                                            <th className="minimal-th">Date</th>
                                            <th className="minimal-th">Item Information</th>
                                            <th className="minimal-th text-right text-emerald-300">Reserved</th>
                                            <th className="minimal-th text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {reportData.map((r, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="minimal-td font-black text-[#ab8a3b] font-mono leading-none">{String(r.bookingId)}</td>
                                                <td className="minimal-td text-slate-500 font-mono text-[11px] leading-none">{String(r.date)}</td>
                                                <td className="minimal-td">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[#111f42] font-mono text-[11px] leading-none">{String(r.sku)}</span>
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase truncate max-w-[200px] mt-1">{String(r.productName)}</span>
                                                    </div>
                                                </td>
                                                <td className="minimal-td text-right font-black text-[#111f42] font-mono bg-emerald-50/10 leading-none">{formatNum(r.qty)}</td>
                                                <td className="minimal-td text-center leading-none"><span className={`badge ${getStatusClass(r.status)}`}>{String(r.status)}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4 py-32">
                                    <FileBarChart size={64} strokeWidth={1.5} className="opacity-40" />
                                    <p className="text-[12px] font-bold uppercase tracking-widest font-mono">Select date range and generate report</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <AllocationModal 
                isOpen={showModal} 
                selectedItem={selectedItem} 
                form={form} 
                setForm={setForm} 
                closeModal={() => setShowModal(false)} 
                submitBooking={submitBooking} 
            />

            <TagPrintModal 
                isOpen={showTagModal} 
                selectedItem={selectedItem} 
                printFormat={printFormat} 
                setPrintFormat={setPrintFormat} 
                qrCodeUrl={qrCodeUrl} 
                barcodeUrl={barcodeUrl} 
                closeModal={() => setShowTagModal(false)} 
                executePrintTag={executePrintTag} 
            />

            <ReportPreviewModal 
                isOpen={showReportPreview} 
                reportData={reportData} 
                reportDateRange={reportDateRange} 
                closeModal={() => setShowReportPreview(false)} 
            />

            <DetailPreviewModal 
                isOpen={showBookingPreview} 
                selectedItem={selectedItem} 
                closeModal={() => setShowBookingPreview(false)} 
            />

            <GuideDrawer 
                isOpen={isGuideOpen} 
                closeDrawer={() => setIsGuideOpen(false)} 
            />

            <NotificationModal {...notif} onClose={() => setNotif({ ...notif, isOpen: false })} />
            
            {loading && (
                <div className="fixed inset-0 z-[100000] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 animate-in fade-in font-mono">
                    <Loader2 className="animate-spin text-[#ab8a3b]" size={48} />
                    <p className="font-black text-[#111f42] uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Inventory...</p>
                </div>
            )}
        </div>
    );
}
