import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    ArrowDownToLine, LayoutList, Truck, PackageMinus, ArrowUpRight, 
    Factory, CheckCircle, Search, UploadCloud, PlusCircle, 
    ChevronLeft, ChevronRight
} from 'lucide-react';

import { 
    DeliveryOrder, MrpOrder, HistoryLog, TabType, ModalType, ManualItem 
} from './types';
import { 
    WAREHOUSES, STATUSES, 
    MOCK_DELIVERY_ORDERS, MOCK_MRP_ORDERS, MOCK_HISTORY_LOGS 
} from './constants';

import { useMasterData } from '../../context/MasterDataContext';
import { useGoogleSheets } from '../../hooks/useGoogleSheets';
import KpiCard from './components/KpiCard';
import OutboundTable from './components/OutboundTable';
import DeliveryTable from './components/DeliveryTable';
import MrpTable from './components/MrpTable';
import OutboundModal from './components/OutboundModal';
import { CsvUploadModal } from '../../components/shared/CsvUploadModal';

export default function WarehouseOut() {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState<TabType>('delivery');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [modalType, setModalType] = useState<ModalType>('SO'); 
    const [editingLogId, setEditingLogId] = useState<number | null>(null);
    const [activeWhTab, setActiveWhTab] = useState('All');
    
    // Pagination
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Data State
    const { items } = useMasterData();
    const productMaster = items.map(item => ({ sku: item.itemCode, name: item.itemName }));
    const { data: deliveryOrders, updateRow: updateDO, loading: doLoading } = useGoogleSheets<DeliveryOrder>('DeliveryOrders');
    const { data: mrpOrders, updateRow: updateMRP, loading: mrpLoading } = useGoogleSheets<MrpOrder>('MrpOrders');
    const { data: historyLogs, addRow: addLog, updateRow: updateLog, loading: logLoading } = useGoogleSheets<HistoryLog>('WarehouseOutLogs');

    const loading = doLoading || mrpLoading || logLoading;

    // Form State
    const [form, setForm] = useState({
        date: '', qty: 0, location: '', warehouseName: '', lotNo: '', remark: '', refNo: '', itemName: '', outType: '', manualItems: [] as ManualItem[]
    });

    // Dropdown State
    const [dropdownState, setDropdownState] = useState({
        show: false, x: 0, y: 0, width: 0, items: productMaster, targetIndex: null as number | null
    });

    // Upload State
    const [showUploadModal, setShowUploadModal] = useState(false);

    // --- Initial Data Fetch ---
    // Removed mock data initialization as it now uses Google Sheets API

    // --- Computed / Memoized Values ---
    const filteredLogs = useMemo(() => {
        let res = historyLogs;
        if (activeWhTab !== 'All') res = res.filter(l => l.warehouseName === activeWhTab);
        if (searchQuery && activeTab === 'all') {
            const q = searchQuery.toLowerCase();
            res = res.filter(l => l.transId.toLowerCase().includes(q) || l.sku.toLowerCase().includes(q));
        }
        return res;
    }, [historyLogs, activeWhTab, searchQuery, activeTab]);

    const filteredDeliveryOrders = useMemo(() => {
        let res = deliveryOrders;
        if (statusFilter !== 'All') res = res.filter(o => o.status === statusFilter);
        if (searchQuery && activeTab === 'delivery') {
            const q = searchQuery.toLowerCase();
            res = res.filter(o => o.soNo.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.sku.toLowerCase().includes(q));
        }
        return res;
    }, [deliveryOrders, statusFilter, searchQuery, activeTab]);

    const filteredMRPOrders = useMemo(() => {
        let res = mrpOrders;
        if (statusFilter !== 'All') res = res.filter(o => o.status === statusFilter);
        if (searchQuery && activeTab === 'mrp') {
            const q = searchQuery.toLowerCase();
            res = res.filter(o => o.moNo.toLowerCase().includes(q) || o.rmSku.toLowerCase().includes(q) || o.fgSku.toLowerCase().includes(q));
        }
        return res;
    }, [mrpOrders, statusFilter, searchQuery, activeTab]);

    const getCurrentData = () => {
        if (activeTab === 'all') return filteredLogs;
        if (activeTab === 'delivery') return filteredDeliveryOrders;
        return filteredMRPOrders;
    };

    const currentData = getCurrentData();
    const totalPages = Math.ceil(currentData.length / itemsPerPage) || 1;
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return currentData.slice(start, start + itemsPerPage);
    }, [currentData, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, activeWhTab, statusFilter, searchQuery]);

    const stats = useMemo(() => {
        return {
            todayOut: 50,
            pendingDelivery: deliveryOrders.filter(o => o.status !== 'Completed').length,
            pendingMRP: mrpOrders.filter(o => o.status !== 'Completed').length,
            completed: deliveryOrders.filter(o => o.status === 'Completed').length + mrpOrders.filter(o => o.status === 'Completed').length
        };
    }, [deliveryOrders, mrpOrders]);

    // --- Handlers ---
    const getStatusClass = (status: string) => {
        switch(status) {
            case 'Ready': return 'bg-blue-50 text-[#809BBF] border-blue-200';
            case 'Partial': return 'bg-amber-50 text-[#ab8a3b] border-amber-200';
            case 'Completed': return 'bg-emerald-50 text-[#10b981] border-emerald-200';
            case 'Delivered': return 'bg-emerald-50 text-[#10b981] border-emerald-200';
            default: return 'bg-slate-50 text-slate-500 border-slate-200';
        }
    };

    const getProgressColor = (item: any) => {
        const total = item.qty;
        const done = item.shipped || item.issued || 0;
        const pct = done / total;
        if (pct >= 1) return '#10b981'; // Green
        if (pct > 0) return '#ab8a3b'; // Gold
        return '#809BBF'; // BlueGrey
    };

    const getStatusCount = (status: string) => {
        if (activeTab === 'delivery') {
            if (status === 'All') return deliveryOrders.length;
            return deliveryOrders.filter(o => o.status === status).length;
        } else if (activeTab === 'mrp') {
            if (status === 'All') return mrpOrders.length;
            return mrpOrders.filter(o => o.status === status).length;
        }
        return 0;
    };

    const openOutboundModal = (item: any, type: ModalType) => {
        setSelectedItem(item);
        setModalType(type);
        setEditingLogId(null);
        
        const now = new Date().toISOString().slice(0, 16);
        let newForm = { ...form, date: now };

        if (type === 'MANUAL') {
            newForm.manualItems = [{ productSearch: '', sku: '', itemName: '', qty: 0, warehouseName: '', location: '', lotNo: '', remark: '' }];
            newForm.outType = 'Sample / Free Goods';
            newForm.refNo = '';
        } else {
            newForm.qty = item ? Math.max(0, item.qty - (item.shipped || item.issued || 0)) : 0;
            newForm.location = '';
            newForm.warehouseName = type === 'SO' ? 'FG' : 'RM';
            newForm.lotNo = '';
            newForm.remark = '';
            newForm.refNo = '';
            newForm.itemName = '';
            newForm.outType = type === 'SO' ? 'Sales Order' : 'Production Issue';
        }
        setForm(newForm);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
        setEditingLogId(null);
    };

    const generateTrxId = () => {
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const dateStr = `${yy}${mm}${dd}`; 
        let count = 1;
        const lastLog = historyLogs[0];
        if (lastLog && lastLog.transId.includes(`GO${dateStr}`)) {
             const parts = lastLog.transId.split('-');
             if (parts.length === 2) count = parseInt(parts[1]) + 1;
        }
        return `GO${dateStr}-${String(count).padStart(3, '0')}`;
    };

    const submitOutbound = async (completeJob = false) => {
        try {
            if (modalType === 'MANUAL') {
                for (let i = 0; i < form.manualItems.length; i++) {
                    const item = form.manualItems[i];
                    await addLog({
                        id: Date.now() + i,
                        transId: generateTrxId(),
                        date: form.date.replace('T', ' '),
                        outType: form.outType,
                        refNo: form.refNo,
                        sku: item.sku,
                        itemName: item.itemName,
                        qty: Number(item.qty),
                        location: item.location,
                        warehouseName: item.warehouseName,
                        lotNo: item.lotNo,
                        status: 'Pending',
                        by: 'Admin'
                    });
                }
            } else {
                if (selectedItem) {
                    if (modalType === 'SO') {
                        const newShipped = (Number(selectedItem.shipped) || 0) + Number(form.qty);
                        await updateDO(selectedItem.id, { 
                            shipped: newShipped, 
                            status: (completeJob || newShipped >= Number(selectedItem.qty)) ? 'Completed' : 'Partial' 
                        });
                    } else if (modalType === 'MRP') {
                        const newIssued = (Number(selectedItem.issued) || 0) + Number(form.qty);
                        await updateMRP(selectedItem.id, { 
                            issued: newIssued, 
                            status: (completeJob || newIssued >= Number(selectedItem.qty)) ? 'Completed' : 'Partial' 
                        });
                    }
                }
                await addLog({
                    id: Date.now(),
                    transId: generateTrxId(),
                    date: form.date.replace('T', ' '),
                    outType: form.outType,
                    refNo: selectedItem?.soNo || selectedItem?.moNo,
                    sku: selectedItem?.sku || selectedItem?.rmSku,
                    itemName: selectedItem?.productName || selectedItem?.rmName,
                    qty: Number(form.qty),
                    location: form.location,
                    warehouseName: form.warehouseName,
                    lotNo: form.lotNo,
                    status: 'Pending',
                    by: 'Admin'
                });
            }

            window.alert('Outbound transaction recorded successfully.');
            closeModal();
        } catch (error) {
            console.error('Error submitting outbound:', error);
            window.alert('Error submitting outbound transaction.');
        }
    };

    const confirmComplete = async (order: any, type: 'SO' | 'MRP') => {
        if (window.confirm('Mark this order as Completed?')) {
            try {
                if (type === 'SO') {
                    await updateDO(order.id, { status: 'Completed' });
                } else if (type === 'MRP') {
                    await updateMRP(order.id, { status: 'Completed' });
                }
            } catch (error) {
                console.error('Error confirming order:', error);
                window.alert('Error confirming order.');
            }
        }
    };

    const editLog = (log: HistoryLog) => { 
        setEditingLogId(Number(log.id)); 
        setModalType('MANUAL'); 
        setForm({
            ...form,
            date: log.date.replace(' ', 'T'),
            outType: log.outType,
            refNo: log.refNo,
            qty: Number(log.qty),
            location: log.location,
            warehouseName: log.warehouseName,
            lotNo: log.lotNo,
            remark: log.remark || '',
            itemName: log.itemName
        });
        setShowModal(true); 
    };

    const confirmLog = async (log: HistoryLog) => { 
        if(window.confirm('Confirm this transaction?')) {
            try {
                await updateLog(log.id, { status: 'Confirmed' });
            } catch (error) {
                console.error('Error confirming log:', error);
                window.alert('Error confirming transaction.');
            }
        }
    };

    const cancelLog = async (log: HistoryLog) => { 
        if(window.confirm('Cancel this transaction?')) {
            try {
                await updateLog(log.id, { status: 'Cancelled' });
            } catch (error) {
                console.error('Error cancelling log:', error);
                window.alert('Error cancelling transaction.');
            }
        }
    };

    const handleManualItemChange = (index: number, field: string, value: any) => {
        setForm(prev => {
            const newItems = [...prev.manualItems];
            (newItems[index] as any)[field] = value;
            return { ...prev, manualItems: newItems };
        });
        if (field === 'productSearch') {
            filterDropdown(value);
        }
    };

    const openDropdown = (event: any, index: number) => {
        const rect = event.target.getBoundingClientRect();
        setDropdownState(prev => ({
            ...prev,
            show: true,
            x: rect.left,
            y: rect.bottom,
            width: rect.width,
            targetIndex: index
        }));
        filterDropdown(form.manualItems[index].productSearch);
    };

    const filterDropdown = (query: string) => {
        if (!query) {
            setDropdownState(prev => ({ ...prev, items: productMaster }));
        } else {
            const q = query.toLowerCase();
            setDropdownState(prev => ({ 
                ...prev, 
                items: productMaster.filter(p => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)) 
            }));
        }
    };

    const selectGlobalProduct = (product: any) => {
        if (dropdownState.targetIndex !== null) {
            setForm(prev => {
                const newItems = [...prev.manualItems];
                const item = newItems[dropdownState.targetIndex!];
                item.sku = product.sku;
                item.itemName = product.name;
                item.productSearch = `${product.sku} : ${product.name}`;
                return { ...prev, manualItems: newItems };
            });
        }
        setDropdownState(prev => ({ ...prev, show: false }));
    };

    const confirmUpload = async (parsedData: any[]) => {
        try {
            for (let idx = 0; idx < parsedData.length; idx++) {
                const row = parsedData[idx];
                const newLog = {
                    id: Date.now().toString() + idx,
                    transId: generateTrxId(),
                    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                    outType: row.outType || 'Adjustment',
                    refNo: 'CSV Import',
                    sku: row.sku || '',
                    itemName: row.itemName || 'Unknown',
                    qty: parseFloat(row.qty) || 0,
                    location: row.location || '',
                    warehouseName: row.warehouseName || 'Main WH',
                    lotNo: row.lotNo || '',
                    remark: row.remark || '',
                    status: 'Confirmed', 
                    by: 'Admin (CSV)'
                };
                await addLog(newLog);
            }
            setShowUploadModal(false);
            window.alert(`Imported ${parsedData.length} records successfully.`);
        } catch (error) {
            console.error('Error importing data:', error);
            window.alert('Error importing data');
        }
    };

    return (
        <div className="pt-8 px-8 pb-10 min-h-screen bg-[#F9F7F6]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800;900&family=Noto+Sans+Thai:wght@300;400;500;600;700;900&display=swap');
                * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
                .master-custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .master-custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .master-custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .minimal-th { font-size: 11px !important; text-transform: uppercase; letter-spacing: 0.1em; color: #FFFFFF; padding: 16px 12px; font-weight: 800; background-color: #111f42; border-bottom: 2px solid #ab8a3b; white-space: nowrap; }
                .minimal-td { padding: 12px 12px; vertical-align: middle; color: #111f42; font-size: 12px !important; font-weight: 500; border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
                .filter-btn { border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; transition: all 0.3s; white-space: nowrap; border: 1px solid transparent; padding: 0.5rem 1rem; }
                .filter-btn.active { background-color: #111f42; color: #FFFFFF; }
                .filter-btn:not(.active) { color: #64748B; background-color: transparent; }
                .filter-btn:not(.active):hover { color: #111f42; background-color: rgba(255,255,255,0.5); }
                .filter-count { display: flex; align-items: center; justify-content: center; height: 16px; min-width: 16px; padding: 0 4px; border-radius: 9999px; font-size: 9px; font-weight: 700; margin-left: 6px; }
                .filter-btn.active .filter-count { background-color: rgba(255, 255, 255, 0.2); color: white; }
                .filter-btn:not(.active) .filter-count { background-color: #E2E8F0; color: #64748B; }
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(17, 31, 66, 0.6); backdrop-filter: blur(4px); z-index: 10001; display: flex; justify-content: center; align-items: center; padding: 1rem; }
                .modal-box { background: #F9F7F6; width: 100%; max-height: 90vh; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; display: flex; flex-direction: column; }
                .badge { display: inline-flex; align-items: center; padding: 0.15rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 10px; border: 1px solid transparent; text-transform: uppercase; }
                .input-primary { width: 100%; background: white; border: 1px solid #E2E8F0; border-radius: 0.5rem; padding: 8px 12px; font-size: 13px; transition: all 0.2s; color: #111f42; outline: none;}
                .input-primary:focus { border-color: #ab8a3b; box-shadow: 0 0 0 2px rgba(171, 138, 59, 0.1); }
                .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 z-10 animate-fade-in-up border-b border-slate-100">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white shadow-sm flex-shrink-0 border border-slate-200 relative">
                            <ArrowDownToLine size={28} className="text-[#111f42]" strokeWidth={2.5} />
                            <div className="absolute bottom-[14px] right-[14px] w-[6px] h-[6px] bg-[#ab8a3b] rounded-[1px]"></div>
                        </div>
                        <div>
                            <h1 className="text-3xl tracking-tight whitespace-nowrap uppercase leading-none font-mono">
                                <span className="font-light text-[#111f42]">WAREHOUSE</span> <span className="font-black text-[#E3624A]">OUT</span>
                            </h1>
                            <p className="text-slate-500 text-[11px] mt-1.5 font-bold">
                                <span className="tracking-normal ml-1">รายการส่งมอบสินค้า & เบิกวัตถุดิบ</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner w-full md:w-fit flex-shrink-0 rounded-xl overflow-hidden">
                        <button onClick={() => setActiveTab('all')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-wide rounded-lg ${activeTab === 'all' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <LayoutList size={14} /> ALL OUTBOUND
                        </button>
                        <button onClick={() => setActiveTab('delivery')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-wide rounded-lg ${activeTab === 'delivery' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <Truck size={14} /> DELIVERY LIST
                        </button>
                        <button onClick={() => setActiveTab('mrp')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-wide rounded-lg ${activeTab === 'mrp' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <PackageMinus size={14} /> MRP LIST (RM)
                        </button>
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto master-custom-scrollbar relative z-10 py-6 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
                        <KpiCard title="Outbound Today" val={stats.todayOut} color="#111f42" IconComponent={ArrowUpRight} desc="Total Units Issued" />
                        <KpiCard title="Pending Delivery" val={stats.pendingDelivery} color="#ab8a3b" IconComponent={Truck} desc="Wait for Shipping" />
                        <KpiCard title="Pending Production" val={stats.pendingMRP} color="#E3624A" IconComponent={Factory} desc="RM to Issue" />
                        <KpiCard title="Completed Today" val={stats.completed} color="#10b981" IconComponent={CheckCircle} desc="Docs Closed" />
                    </div>

                    <div className="bg-white rounded-none shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[500px]">
                        <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/50">
                            <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto mr-auto">
                                <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200 shadow-sm shrink-0 overflow-x-auto no-scrollbar">
                                    {activeTab === 'all' ? (
                                        WAREHOUSES.map(wh => (
                                            <button key={wh} onClick={() => setActiveWhTab(wh)} 
                                                className={`filter-btn flex items-center gap-2 capitalize font-mono ${activeWhTab === wh ? 'active' : ''}`}>
                                                <span>{wh}</span>
                                            </button>
                                        ))
                                    ) : (
                                        STATUSES.map(status => (
                                            <button key={status} onClick={() => setStatusFilter(status)} 
                                                className={`filter-btn flex items-center gap-2 capitalize font-mono ${statusFilter === status ? 'active' : ''}`}>
                                                <span>{status}</span>
                                                <span className="filter-count text-[9px] h-4 min-w-[16px]">{getStatusCount(status)}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                            
                            {activeTab === 'all' && (
                                <div className="flex gap-2 shrink-0 flex-nowrap items-center ml-auto">
                                    <button onClick={() => setShowUploadModal(true)} className="px-5 py-2.5 rounded-xl text-[12px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-2 uppercase tracking-wide whitespace-nowrap transition-all">
                                        <UploadCloud size={16} /> UPLOAD
                                    </button>
                                    
                                    <button onClick={() => openOutboundModal(null, 'MANUAL')} className="px-5 py-2.5 rounded-xl text-[12px] font-bold bg-[#111f42] text-white shadow-md flex items-center gap-2 uppercase tracking-wide whitespace-nowrap hover:bg-[#1e346b] transition-all">
                                        <PlusCircle size={16} className="text-[#ab8a3b]" /> OUTBOUND
                                    </button>
                                </div>
                            )}
                        </div>

                        {activeTab === 'all' && (
                            <OutboundTable 
                                data={currentData as HistoryLog[]} 
                                onEdit={editLog} 
                                onConfirm={confirmLog} 
                                onCancel={cancelLog} 
                            />
                        )}

                        {activeTab === 'delivery' && (
                            <DeliveryTable 
                                data={currentData as DeliveryOrder[]} 
                                onShip={(o) => openOutboundModal(o, 'SO')} 
                                onComplete={(o) => confirmComplete(o, 'SO')} 
                                getProgressColor={getProgressColor} 
                                getStatusClass={getStatusClass} 
                            />
                        )}

                        {activeTab === 'mrp' && (
                            <MrpTable 
                                data={currentData as MrpOrder[]} 
                                onIssue={(o) => openOutboundModal(o, 'MRP')} 
                                onComplete={(o) => confirmComplete(o, 'MRP')} 
                                getProgressColor={getProgressColor} 
                                getStatusClass={getStatusClass} 
                            />
                        )}
                    </div>
                </main>

                <OutboundModal 
                    show={showModal}
                    type={modalType}
                    editingId={editingLogId}
                    selectedItem={selectedItem}
                    form={form}
                    onClose={closeModal}
                    onFormChange={(f, v) => setForm(prev => ({ ...prev, [f]: v }))}
                    onManualItemChange={handleManualItemChange}
                    onAddManualItem={() => setForm(prev => ({ ...prev, manualItems: [...prev.manualItems, { productSearch: '', sku: '', itemName: '', qty: 0, warehouseName: '', location: '', lotNo: '', remark: '' }] }))}
                    onRemoveManualItem={(idx) => setForm(prev => ({ ...prev, manualItems: prev.manualItems.filter((_, i) => i !== idx) }))}
                    onSubmit={submitOutbound}
                    onOpenDropdown={openDropdown}
                />
                
                <CsvUploadModal 
                    isOpen={showUploadModal} 
                    onClose={() => setShowUploadModal(false)} 
                    onConfirm={confirmUpload} 
                    expectedHeaders={['outType', 'sku', 'itemName', 'qty', 'warehouseName', 'location', 'lotNo', 'remark']}
                    title="Upload Outbound Logs"
                />

                {dropdownState.show && (
                    <div 
                        style={{ top: dropdownState.y + 'px', left: dropdownState.x + 'px', width: dropdownState.width + 'px' }}
                        className="fixed z-[10005] bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-fade-in-up master-custom-scrollbar mt-1 py-1"
                    >
                        {dropdownState.items.map(p => (
                            <div key={p.sku} 
                                onMouseDown={() => selectGlobalProduct(p)}
                                className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 group flex flex-col gap-0.5">
                                <div className="text-[11px] font-black text-[#111f42] group-hover:text-[#ab8a3b] font-mono">{p.sku}</div>
                                <div className="text-[10px] text-slate-500 font-medium truncate">{p.name}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
