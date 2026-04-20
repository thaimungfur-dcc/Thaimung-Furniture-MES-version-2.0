import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    ClipboardList, Truck, Search, 
    UploadCloud, PlusCircle, 
    CheckCircle, Calendar, FileBarChart, Filter, ChevronDown, 
    Eye, Tag, Printer, Download, PowerOff, ArrowDownToLine, HelpCircle, Loader2
} from 'lucide-react';

import { useMasterData } from '../../context/MasterDataContext';
import { useGoogleSheets } from '../../hooks/useGoogleSheets';
import { NotificationModal } from './components/NotificationModal';
import { KpiCard } from './components/KpiCard';
import { OrderViewModal } from './components/OrderViewModal';
import { GuideDrawer } from './components/GuideDrawer';
import { PrintTagModal } from './components/PrintTagModal';
import { PrintDocModal } from './components/PrintDocModal';
import { ReportPreviewModal } from './components/ReportPreviewModal';
import { ReceiveFormModal } from './components/ReceiveFormModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import InboundLogTable from './components/InboundLogTable';
import PendingJOTable from './components/PendingJOTable';
import PendingPOTable from './components/PendingPOTable';
import { CsvUploadModal } from '../../components/shared/CsvUploadModal';

export default function WarehouseInApp() {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('all'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('In Progress');
    const [activeWhTab, setActiveWhTab] = useState('All');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('2026-03');
    
    // Feature Modals
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('JO'); 
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [notif, setNotif] = useState({ isOpen: false, title: '', message: '', type: 'success' });
    
    // New Feature States
    const [activeTransaction, setActiveTransaction] = useState<any>(null);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showTagModal, setShowTagModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showPrintDocModal, setShowPrintDocModal] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [barcodeUrl, setBarcodeUrl] = useState('');
    const [printFormat, setPrintFormat] = useState('A5');

    // Document Order View State
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [viewOrderData, setViewOrderData] = useState<any>(null);
    
    // Report State
    const [reportDateRange, setReportDateRange] = useState({ start: '', end: '' });
    const [reportData, setReportData] = useState<any[]>([]);
    const [showReportPreview, setShowReportPreview] = useState(false);

    // Data State
    const { items } = useMasterData();
    const { data: jobOrders, addRow: addJO, updateRow: updateJO, loading: joLoading } = useGoogleSheets<any>('JobOrders');
    const { data: purchaseOrders, addRow: addPO, updateRow: updatePO, loading: poLoading } = useGoogleSheets<any>('PurchaseOrders');
    const { data: historyLogs, addRow: addLog, updateRow: updateLog, loading: logLoading } = useGoogleSheets<any>('HistoryLogs');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const loading = joLoading || poLoading || logLoading;

    // Form State
    const [form, setForm] = useState({
        date: '', qty: 0, location: '', warehouseName: '', lotNo: '', mfgDate: '', remark: '', refNo: '', itemName: '', receiveType: '', manualItems: [] as any[]
    });

    // Constants
    const warehouses = ['All', 'FG', 'RM', 'WIP', 'REWORK', 'SCRAP'];
    const statuses = ['Not Started', 'In Progress', 'Completed', 'All'];
    const receiveTypes = ['Production', 'Purchase', 'Return', 'Transfer', 'Consignment', 'Free Goods', 'Subcontract', 'Rework Return', 'Adjustment', 'Opening'];
    const productMaster = items.map(item => ({ sku: item.itemCode, name: item.itemName }));

    // Load QR and Barcode libraries dynamically
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
        ]).then(() => {
            console.log('Barcode/QR libraries loaded');
        });
    }, []);

    // Generate QR and Barcode on Tag Modal open
    useEffect(() => {
        if (showTagModal && activeTransaction) {
            const dataToEncode = String(activeTransaction.transId || activeTransaction.id);
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
    }, [showTagModal, activeTransaction]);

    // --- Logic & Filtering ---
    const filteredLogs = useMemo(() => {
        let res = historyLogs;
        if (activeWhTab !== 'All') res = res.filter(l => l.warehouseName === activeWhTab);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(l => String(l.transId).toLowerCase().includes(q) || String(l.sku).toLowerCase().includes(q) || String(l.itemName).toLowerCase().includes(q));
        }
        return res;
    }, [historyLogs, activeWhTab, searchQuery]);

    const filteredJOs = useMemo(() => {
        let res = jobOrders;
        if (statusFilter !== 'All') res = res.filter(j => j.status === statusFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(j => String(j.joNo).toLowerCase().includes(q) || String(j.productName).toLowerCase().includes(q));
        }
        return res;
    }, [jobOrders, statusFilter, searchQuery]);

    const filteredPOs = useMemo(() => {
        let res = purchaseOrders;
        if (statusFilter !== 'All') res = res.filter(p => p.status === statusFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(p => String(p.poNo).toLowerCase().includes(q) || String(p.itemName).toLowerCase().includes(q));
        }
        return res;
    }, [purchaseOrders, statusFilter, searchQuery]);

    const currentData = useMemo(() => {
        if (activeTab === 'all') return filteredLogs;
        if (activeTab === 'pending_jo') return filteredJOs;
        if (activeTab === 'pending_po') return filteredPOs;
        return [];
    }, [activeTab, filteredLogs, filteredJOs, filteredPOs]);

    const stats = useMemo(() => {
        const today = new Date().toISOString().slice(0, 10);
        return {
            todayIn: historyLogs.filter(l => String(l.date).includes(today)).reduce((acc, l) => acc + (Number(l.qty) || 0), 0),
            pendingJobs: jobOrders.filter(j => j.status === 'In Progress' || j.status === 'Not Started').length,
            pendingPOs: purchaseOrders.filter(p => p.status === 'In Progress' || p.status === 'Not Started').length,
            completed: historyLogs.length
        };
    }, [historyLogs, jobOrders, purchaseOrders]);

    // --- Handlers ---
    const showToast = (title: string, message: string, type = 'success') => setNotif({ isOpen: true, title, message, type });

    const generateReport = () => {
        if (!reportDateRange.start || !reportDateRange.end) {
            showToast('Warning', 'กรุณาระบุช่วงวันที่ให้ครบถ้วน', 'warning');
            return;
        }
        const filtered = historyLogs.filter(log => {
            const logDate = String(log.date).split(' ')[0];
            return logDate >= reportDateRange.start && logDate <= reportDateRange.end;
        });
        setReportData(filtered);
        showToast('Success', `พบข้อมูลรายงาน ${filtered.length} รายการ`, 'success');
    };

    const getStatusClass = (status: string) => {
        switch(status) {
            case 'Not Started': return 'bg-slate-100 text-slate-500 border-slate-200';
            case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            default: return 'bg-slate-50 text-slate-400 border-slate-200';
        }
    };

    const getProgressColor = (item: any) => {
        const pct = (Number(item.received) || 0) / (Number(item.qty) || 1);
        if (pct >= 1) return '#10b981';
        if (pct > 0) return '#3b82f6';
        return '#cbd5e1';
    };

    const openReceiveModal = (item: any, type: string) => {
        setSelectedItem(item);
        setModalType(type);
        
        const now = new Date().toISOString().slice(0, 16);
        if (type === 'MANUAL') {
            setForm({
                date: now, manualItems: [{ sku: '', itemName: '', qty: 0, warehouseName: 'FG', location: '', lotNo: '', mfgDate: new Date().toISOString().slice(0, 10), remark: '' }],
                receiveType: 'Return', refNo: '', qty: 0, location: '', warehouseName: '', lotNo: '', mfgDate: '', remark: '', itemName: ''
            });
        } else {
            setForm({
                date: now, qty: item ? Math.max(0, Number(item.qty) - Number(item.received)) : 0, location: '', warehouseName: type === 'JO' ? 'FG' : 'RM',
                lotNo: `LOT-${Date.now().toString().slice(-6)}`, mfgDate: new Date().toISOString().slice(0, 10),
                remark: '', refNo: item?.joNo || item?.poNo || '', receiveType: type === 'JO' ? 'Production' : 'Purchase',
                itemName: '', manualItems: []
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const handleManualItemChange = (idx: number, field: string, val: any) => {
        const newItems = [...form.manualItems];
        newItems[idx][field] = val;
        setForm({ ...form, manualItems: newItems });
    };

    const submitReceive = async (isComplete = false) => {
        const timestamp = new Date().toLocaleString('en-GB').replace(',', '');
        try {
            if (modalType === 'MANUAL') {
                if (form.manualItems.length === 0 || !form.manualItems[0].sku) return showToast('Error', 'กรุณาระบุข้อมูลสินค้า', 'error');
                for (let i = 0; i < form.manualItems.length; i++) {
                    const item = form.manualItems[i];
                    await addLog({
                        id: String(Date.now() + i), transId: `GR${Date.now().toString().slice(-6)}-${i}`,
                        receiveFrom: form.receiveType, refNo: form.refNo, date: timestamp, sku: item.sku,
                        itemName: item.itemName, qty: Number(item.qty), location: item.location,
                        warehouseName: item.warehouseName, lotNo: item.lotNo, mfgDate: item.mfgDate, expDate: '', remark: item.remark,
                        status: 'Confirmed', by: 'Admin'
                    });
                }
            } else {
                if (form.qty <= 0) return showToast('Error', 'กรุณาระบุจำนวนที่รับเข้า', 'error');
                const newLog = {
                    id: String(Date.now()), transId: `GR${Date.now().toString().slice(-6)}`,
                    receiveFrom: form.receiveType, refNo: form.refNo, date: timestamp,
                    sku: selectedItem.sku, itemName: selectedItem.productName || selectedItem.itemName,
                    qty: Number(form.qty), location: form.location, warehouseName: form.warehouseName,
                    lotNo: form.lotNo, mfgDate: form.mfgDate, expDate: '', remark: form.remark, status: 'Confirmed', by: 'Admin'
                };
                await addLog(newLog);
                
                // Update Source Data status dynamically
                const newReceived = (Number(selectedItem.received) || 0) + Number(form.qty);
                const newStatus = (isComplete || newReceived >= Number(selectedItem.qty)) ? 'Completed' : 'In Progress';

                if (modalType === 'JO') {
                    await updateJO(selectedItem.id, { received: newReceived, status: newStatus });
                } else {
                    await updatePO(selectedItem.id, { received: newReceived, status: newStatus });
                }
            }
            closeModal();
            showToast('Success', 'บันทึกการรับสินค้าเข้าคลังเรียบร้อยแล้ว', 'success');
        } catch (error) {
            console.error('Error submitting receive:', error);
            showToast('Error', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
        }
    };

    // --- Action Modals Handlers ---
    const openTransactionDetail = (trx: any) => {
        setActiveTransaction({...trx});
        setShowTransactionModal(true);
    };

    const updateTransaction = async () => {
        setIsSubmitting(true);
        try {
            await updateLog(activeTransaction.id, activeTransaction);
            setShowTransactionModal(false);
            showToast('Success', 'อัปเดตข้อมูลรายการเรียบร้อยแล้ว', 'success');
        } catch (error) {
            console.error('Error updating transaction:', error);
            showToast('Error', 'ไม่สามารถอัปเดตข้อมูลได้', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openTagModal = (trx: any) => {
        setActiveTransaction(trx);
        setShowTagModal(true);
    };

    const executePrintTag = () => {
        const win = window.open('', '_blank');
        if (!win) return;
        const printContent = document.getElementById('tag-print-area')?.innerHTML;
        win.document.write(`
            <html><head><title>Print Tag</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@800&family=Noto+Sans+Thai:wght@400;700;900&display=swap');
                body { margin: 0; padding: 0; font-family: 'Noto Sans Thai', sans-serif; -webkit-print-color-adjust: exact; background: white; }
                @page { size: ${printFormat === 'A5' ? 'A5 landscape' : 'A4 portrait'}; margin: 5mm; }
            </style>
            </head><body>${printContent}
            <script>window.onload = function() { setTimeout(() => { window.print(); window.close(); }, 300); };</script>
            </body></html>
        `);
        win.document.close();
    };

    const openPrintDocModal = (trx: any) => {
        setActiveTransaction(trx);
        setShowPrintDocModal(true);
    };

    const executePrintDoc = () => {
        const win = window.open('', '_blank');
        if (!win) return;
        const printContent = document.getElementById('doc-print-area')?.innerHTML;
        win.document.write(`
            <html><head><title>Print Document</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@800&family=Noto+Sans+Thai:wght@400;700;900&display=swap');
                body { margin: 0; padding: 0; font-family: 'Noto Sans Thai', sans-serif; -webkit-print-color-adjust: exact; background: white; }
                @page { size: A4 portrait; margin: 10mm; }
            </style>
            </head><body>${printContent}
            <script>window.onload = function() { setTimeout(() => { window.print(); window.close(); }, 300); };</script>
            </body></html>
        `);
        win.document.close();
    };

    const executeReportPrint = () => {
        setShowReportPreview(false);
        setTimeout(() => window.print(), 100);
    };

    const openOrderView = (item: any, type: string) => {
        setViewOrderData({ ...item, type });
        setShowOrderModal(true);
    };

    const handleForceClose = async (item: any, type: string) => {
        if(window.confirm(`คุณต้องการบังคับปิดงาน ${item.joNo || item.poNo} ใช่หรือไม่? (ถึงแม้จะรับสินค้าไม่ครบ)`)) {
            setIsSubmitting(true);
            try {
                if (type === 'pending_jo') {
                    await updateJO(item.id, { ...item, status: 'Completed' });
                } else {
                    await updatePO(item.id, { ...item, status: 'Completed' });
                }
                showToast('Success', `ปิดงาน ${item.joNo || item.poNo} เรียบร้อยแล้ว`, 'success');
            } catch (error) {
                console.error('Error closing order:', error);
                showToast('Error', 'ไม่สามารถปิดงานได้', 'error');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // --- CSV Import Logic ---
    const confirmImport = async (parsedData: any[]) => {
        if (parsedData.length === 0) return;
        setIsSubmitting(true);
        
        try {
            const timestamp = new Date().toLocaleString('en-GB').replace(',', '');
            for (let i = 0; i < parsedData.length; i++) {
                const item = parsedData[i];
                const newLog = {
                    id: Date.now().toString() + i, 
                    transId: `GR${Date.now().toString().slice(-6)}-${i}`,
                    receiveFrom: item.receiveFrom || 'Import', 
                    refNo: item.refNo || 'CSV', 
                    date: timestamp, 
                    sku: item.sku,
                    itemName: item.itemName || 'Imported Item', 
                    qty: Number(item.qty), 
                    location: item.location || '',
                    warehouseName: item.warehouseName || 'FG', 
                    lotNo: item.lotNo || '', 
                    mfgDate: item.mfgDate || new Date().toISOString().slice(0, 10), 
                    expDate: '', 
                    remark: item.remark || 'Batch Upload',
                    status: 'Confirmed', 
                    by: 'Admin (CSV)'
                };
                await addLog(newLog);
            }

            setShowImportModal(false);
            showToast('Success', `นำเข้าข้อมูลสำเร็จ ${parsedData.length} รายการ`, 'success');
        } catch (error) {
            console.error('Error importing data:', error);
            showToast('Error', 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDateSafe = (dateString: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('en-GB');
        } catch (e) {
            return dateString;
        }
    };


    return (
        <div className="flex flex-col flex-1 bg-[#F9F7F6] pt-8 px-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800;900&family=Noto+Sans+Thai:wght@300;400;500;600;700;900&display=swap');
                * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
                .master-custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .master-custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
                
                .minimal-th { font-size: 11px !important; text-transform: uppercase; letter-spacing: 0.1em; color: #FFFFFF; padding: 14px 16px; font-weight: 800; background-color: #111f42 !important; border-bottom: 2.5px solid #ab8a3b !important; white-space: nowrap; cursor: pointer; transition: background-color 0.2s; }
                .minimal-th:hover { background-color: #1e346b; }
                .minimal-td { padding: 10px 14px; vertical-align: middle; color: #111f42; font-size: 12px !important; font-weight: 500; border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
                tr:hover .minimal-td { background-color: rgba(171, 138, 59, 0.05); }
                
                .filter-btn { border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; transition: all 0.3s; white-space: nowrap; border: 1px solid transparent; display: flex; align-items: center; gap: 0.5rem; }
                .filter-btn.active { background-color: #111f42; color: #FFFFFF; }
                .badge { display: inline-flex; align-items: center; padding: 0.15rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 10px; border: 1px solid transparent; text-transform: uppercase; }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                .input-primary { width: 100%; background: white; border: 1px solid #E2E8F0; border-radius: 0.5rem; padding: 10px 14px; font-size: 12px; transition: all 0.2s; color: #111f42; outline: none; font-weight: bold; }
                .input-primary:focus { border-color: #ab8a3b; box-shadow: 0 0 0 3px rgba(171, 138, 59, 0.08); }

                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(17, 31, 66, 0.6); backdrop-filter: blur(4px); z-index: 10001; display: flex; justify-content: center; align-items: center; opacity: 1; transition: opacity 0.3s ease; padding: 1rem; }

                /* Print Styles */
                @media print {
                  @page { size: A4 portrait; margin: 15mm; }
                  @page tag { size: A5 landscape; margin: 10mm; }
                  body { background-color: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                  .no-print { display: none !important; }
                  .print-only { display: block !important; width: 100% !important; }
                  
                  /* For Tag Print */
                  .print-tag-page { page: tag; }
                  
                  table { page-break-inside: auto; }
                  tr { page-break-inside: avoid; page-break-after: auto; }
                  thead { display: table-header-group; }
                  tfoot { display: table-footer-group; }
                  .break-inside-avoid { page-break-inside: avoid; break-inside: avoid; }
                }
                .print-only { display: none; }
            `}</style>

            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 z-10 bg-[#F9F7F6] no-print font-sans">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl shadow-sm border border-slate-200 relative shrink-0">
                        <ArrowDownToLine size={24} className="text-[#111f42]" strokeWidth={2.5} />
                        <div className="absolute bottom-[10px] right-[10px] w-1.5 h-1.5 bg-[#ab8a3b] rounded-full"></div>
                    </div>
                    <div>
                        <h1 className="text-2xl tracking-tight whitespace-nowrap uppercase leading-none font-mono">
                            <span className="font-light text-[#111f42]">WAREHOUSE</span> <span className="font-black text-[#E3624A]">IN</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-widest opacity-80 font-mono">Stock Receiving System</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mr-1 h-10 px-3">
                        <Calendar size={14} className="text-slate-400 mr-2" />
                        <input type="month" value={selectedMonth} onChange={(e) => {setSelectedMonth(e.target.value); setCurrentPage(1);}} className="text-[12px] font-bold text-[#111f42] outline-none cursor-pointer h-full font-mono bg-transparent" />
                    </div>
                    <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl h-10 overflow-hidden font-sans">
                        <button onClick={() => {setActiveTab('all'); setCurrentPage(1);}} className={`px-5 py-1.5 text-[10px] font-black transition-all rounded-lg uppercase tracking-widest ${activeTab === 'all' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>ALL RECEIVE</button>
                        <button onClick={() => {setActiveTab('pending_jo'); setCurrentPage(1);}} className={`px-5 py-1.5 text-[10px] font-black transition-all rounded-lg uppercase tracking-widest ${activeTab === 'pending_jo' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>PENDING JO</button>
                        <button onClick={() => {setActiveTab('pending_po'); setCurrentPage(1);}} className={`px-5 py-1.5 text-[10px] font-black transition-all rounded-lg uppercase tracking-widest ${activeTab === 'pending_po' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>PENDING PO</button>
                        <button onClick={() => {setActiveTab('report'); setCurrentPage(1);}} className={`px-5 py-1.5 text-[10px] font-black transition-all rounded-lg uppercase tracking-widest flex items-center gap-2 ${activeTab === 'report' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><FileBarChart size={14} /> RECEIVE REPORT</button>
                    </div>
                    <button onClick={() => setIsGuideOpen(true)} className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm"><HelpCircle size={18}/></button>
                </div>
            </header>

            <main className="flex-1 relative z-10 pt-4 flex flex-col gap-6 font-sans no-print">
                
                {activeTab !== 'report' ? (
                    <div className="flex flex-col gap-6 animate-fade-in-up flex-1">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                            <KpiCard title="Received This Month" val={stats.todayIn} color="#111f42" Icon={Calendar} desc="Total Units" />
                            <KpiCard title="Pending JOs" val={stats.pendingJobs} color="#ab8a3b" Icon={ClipboardList} desc="Wait for WH (FG)" />
                            <KpiCard title="Pending POs" val={stats.pendingPOs} color="#72A09E" Icon={Truck} desc="Wait for WH (RM)" />
                            <KpiCard title="Total Records" val={stats.completed} color="#10b981" Icon={CheckCircle} desc="All Transactions" />
                        </div>

                        <div className="bg-white border border-slate-200 flex flex-col min-h-[500px] rounded-none shadow-sm relative overflow-visible">
                            {/* Toolbar */}
                            <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/50 sticky top-0 z-20">
                                <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
                                    <div className="relative shrink-0">
                                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ab8a3b]" size={14} />
                                        <select 
                                            value={activeTab === 'all' ? activeWhTab : statusFilter} 
                                            onChange={(e) => { activeTab === 'all' ? setActiveWhTab(e.target.value) : setStatusFilter(e.target.value); setCurrentPage(1); }} 
                                            className="appearance-none min-w-[200px] bg-white border border-slate-200 rounded-lg pl-9 pr-10 py-2.5 outline-none focus:border-[#ab8a3b] text-[#111f42] font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer font-mono"
                                        >
                                            {activeTab === 'all' ? warehouses.map(wh => <option key={wh} value={wh}>{wh === 'All' ? 'ALL WAREHOUSES' : wh + ' WAREHOUSE'}</option>) : statuses.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronDown size={14} /></div>
                                    </div>
                                    <div className="h-6 w-px bg-slate-200 mx-1 hidden lg:block shrink-0"></div>
                                    <div className="relative w-full lg:w-72 shrink-0">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="text" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} placeholder="Search No / SKU / Item..." className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-[11px] outline-none focus:border-[#ab8a3b] font-bold h-[40px]" />
                                    </div>
                                </div>

                                {activeTab === 'all' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowImportModal(true)} className="h-10 px-5 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 font-mono border border-slate-200">
                                            <UploadCloud size={16} className="text-slate-400" /> UPLOAD CSV
                                        </button>
                                        <button onClick={() => openReceiveModal(null, 'MANUAL')} className="h-10 px-5 rounded-xl bg-[#E3624A] text-white text-[10px] font-black uppercase tracking-widest shadow-md hover:brightness-110 transition-all flex items-center gap-2 font-mono">
                                            <PlusCircle size={16} /> DIRECT RECEIVE
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Table View */}
                            <div className="w-full relative flex-1">
                                {activeTab === 'all' ? (
                                    <InboundLogTable 
                                        data={currentData}
                                        getStatusClass={getStatusClass}
                                        onOpenTransactionDetail={openTransactionDetail}
                                        onOpenPrintDocModal={openPrintDocModal}
                                        onOpenTagModal={openTagModal}
                                    />
                                ) : activeTab === 'pending_jo' ? (
                                    <PendingJOTable 
                                        data={currentData}
                                        getProgressColor={getProgressColor}
                                        getStatusClass={getStatusClass}
                                        onOpenOrderView={openOrderView}
                                        onOpenReceiveModal={(item, type) => openReceiveModal(item, type)}
                                        onForceClose={(item, tab) => handleForceClose(item, tab)}
                                    />
                                ) : (
                                    <PendingPOTable 
                                        data={currentData}
                                        getProgressColor={getProgressColor}
                                        getStatusClass={getStatusClass}
                                        onOpenOrderView={openOrderView}
                                        onOpenReceiveModal={(item, type) => openReceiveModal(item, type)}
                                        onForceClose={(item, tab) => handleForceClose(item, tab)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 flex flex-col min-h-[600px] animate-fade-in-up rounded-none shadow-sm relative mt-4 flex-1">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/50 sticky top-0 z-20">
                            <div className="flex flex-1 items-center gap-4 w-full overflow-x-auto no-scrollbar">
                                <div className="flex items-center gap-3 mr-2 shrink-0">
                                    <div className="w-1.5 h-5 bg-[#ab8a3b] rounded-full shadow-sm"></div>
                                    <h2 className="text-sm font-black text-[#111f42] uppercase tracking-widest leading-none">Receive Report</h2>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">From</label>
                                    <input type="date" value={reportDateRange.start} onChange={(e) => setReportDateRange({...reportDateRange, start: e.target.value})} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-[#111f42] outline-none focus:border-[#ab8a3b] transition-all" />
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">To</label>
                                    <input type="date" value={reportDateRange.end} onChange={(e) => setReportDateRange({...reportDateRange, end: e.target.value})} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-[#111f42] outline-none focus:border-[#ab8a3b] transition-all" />
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
                                            <th className="minimal-th">Trans ID</th>
                                            <th className="minimal-th">Date</th>
                                            <th className="minimal-th">Item Information</th>
                                            <th className="minimal-th">Warehouse / Location</th>
                                            <th className="minimal-th text-right text-emerald-300">Qty In</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white text-[12px]">
                                        {reportData.map((r, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="minimal-td font-black text-[#111f42] font-mono tracking-wider">{String(r.transId)}</td>
                                                <td className="minimal-td text-slate-500 font-mono text-[11px]">{String(r.date)}</td>
                                                <td className="minimal-td">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[#111f42] font-mono text-[11px]">{String(r.sku)}</span>
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase truncate max-w-[200px]">{String(r.itemName)}</span>
                                                    </div>
                                                </td>
                                                <td className="minimal-td">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[#111f42] text-[11px]">{String(r.warehouseName)}</span>
                                                        <span className="text-[10px] text-slate-500 font-mono">{String(r.location)}</span>
                                                    </div>
                                                </td>
                                                <td className="minimal-td text-right font-black text-[#10b981] font-mono text-[13px] bg-emerald-50/30">+{Number(r.qty).toLocaleString()}</td>
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

            {/* MODALS */}
            
            <OrderViewModal 
                showOrderModal={showOrderModal} 
                viewOrderData={viewOrderData} 
                setShowOrderModal={setShowOrderModal} 
                getStatusClass={getStatusClass} 
            />

            <ReceiveFormModal 
                showModal={showModal} 
                closeModal={closeModal} 
                modalType={modalType} 
                selectedItem={selectedItem} 
                form={form} 
                setForm={setForm} 
                receiveTypes={receiveTypes} 
                warehouses={warehouses} 
                productMaster={productMaster} 
                handleManualItemChange={handleManualItemChange} 
                submitReceive={submitReceive} 
            />

            <TransactionDetailModal 
                showTransactionModal={showTransactionModal} 
                activeTransaction={activeTransaction} 
                setShowTransactionModal={setShowTransactionModal} 
                setActiveTransaction={setActiveTransaction} 
                updateTransaction={updateTransaction} 
                warehouses={warehouses} 
            />

            <PrintTagModal 
                showTagModal={showTagModal} 
                activeTransaction={activeTransaction} 
                setShowTagModal={setShowTagModal} 
                printFormat={printFormat} 
                setPrintFormat={setPrintFormat} 
                qrCodeUrl={qrCodeUrl} 
                barcodeUrl={barcodeUrl} 
                executePrintTag={executePrintTag} 
                formatDateSafe={formatDateSafe} 
            />

            <CsvUploadModal 
                isOpen={showImportModal} 
                onClose={() => setShowImportModal(false)}
                title="Batch Inbound Upload"
                expectedHeaders={['sku', 'qty', 'warehouseName', 'location', 'lotNo', 'receiveFrom', 'refNo', 'remark']}
                onConfirm={confirmImport}
            />

            <PrintDocModal 
                showPrintDocModal={showPrintDocModal} 
                activeTransaction={activeTransaction} 
                setShowPrintDocModal={setShowPrintDocModal} 
                executePrintDoc={executePrintDoc} 
                formatDateSafe={formatDateSafe} 
            />

            <ReportPreviewModal 
                showReportPreview={showReportPreview} 
                setShowReportPreview={setShowReportPreview} 
                reportDateRange={reportDateRange} 
                reportData={reportData} 
                executeReportPrint={executeReportPrint} 
            />

            <GuideDrawer 
                isGuideOpen={isGuideOpen} 
                setIsGuideOpen={setIsGuideOpen} 
            />

            {/* Loading Overlay */}
            {(loading || isSubmitting) && (
                <div className="fixed inset-0 z-[20000] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
                    <Loader2 className="animate-spin text-[#ab8a3b]" size={40} />
                    <p className="font-black text-[#111f42] uppercase tracking-[0.3em] text-[9px] animate-pulse font-mono">Syncing Warehouse Ledger...</p>
                </div>
            )}
            
            <NotificationModal {...notif} onClose={() => setNotif({ ...notif, isOpen: false })} />
        </div>
    );
}
