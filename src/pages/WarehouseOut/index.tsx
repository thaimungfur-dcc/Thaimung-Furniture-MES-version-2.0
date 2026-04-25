import React, { useState, useEffect, useMemo } from 'react';
import { 
    ArrowDownToLine, 
    ArrowUpRight, 
    Factory, CheckCircle, 
    Truck, PackageMinus, LayoutList
} from 'lucide-react';

import { 
    DeliveryOrder, MrpOrder, HistoryLog, TabType, ModalType, ManualItem 
} from './types';
import { 
    WAREHOUSES, STATUSES 
} from './constants';

import { useMasterData } from '../../context/MasterDataContext';
import { useGoogleSheets } from '../../hooks/useGoogleSheets';
import OutboundTable from './components/OutboundTable';
import DeliveryTable from './components/DeliveryTable';
import MrpTable from './components/MrpTable';
import OutboundModal from './components/OutboundModal';
import { CsvUploadModal } from '../../components/shared/CsvUploadModal';
import { PageHeader } from '../../components/shared/PageHeader';
import { OutboundKpiSection } from './components/OutboundKpiSection';
import { OutboundToolbar } from './components/OutboundToolbar';

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
    const productMaster = useMemo(() => (items || []).map(item => ({ sku: item.itemCode, name: item.itemName })), [items]);
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
        let res = deliveryOrders || [];
        if (statusFilter !== 'All') res = res.filter(o => o.status === statusFilter);
        if (searchQuery && activeTab === 'delivery') {
            const q = searchQuery.toLowerCase();
            res = res.filter(o => o.soNo.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.sku.toLowerCase().includes(q));
        }
        return res;
    }, [deliveryOrders, statusFilter, searchQuery, activeTab]);

    const filteredMRPOrders = useMemo(() => {
        let res = mrpOrders || [];
        if (statusFilter !== 'All') res = res.filter(o => o.status === statusFilter);
        if (searchQuery && activeTab === 'mrp') {
            const q = searchQuery.toLowerCase();
            res = res.filter(o => o.moNo.toLowerCase().includes(q) || o.rmSku.toLowerCase().includes(q) || o.fgSku.toLowerCase().includes(q));
        }
        return res;
    }, [mrpOrders, statusFilter, searchQuery, activeTab]);

    const getCurrentData = () => {
        if (activeTab === 'all') return filteredLogs || [];
        if (activeTab === 'delivery') return filteredDeliveryOrders || [];
        return filteredMRPOrders || [];
    };

    const currentData = getCurrentData();
    const totalPages = Math.ceil((currentData?.length || 0) / itemsPerPage) || 1;
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return (currentData || []).slice(start, start + itemsPerPage);
    }, [currentData, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, activeWhTab, statusFilter, searchQuery]);

    const stats = useMemo(() => {
        const dOrders = deliveryOrders || [];
        const mOrders = mrpOrders || [];
        return {
            todayOut: 50,
            pendingDelivery: dOrders.filter(o => o.status !== 'Completed').length,
            pendingMRP: mOrders.filter(o => o.status !== 'Completed').length,
            completed: dOrders.filter(o => o.status === 'Completed').length + mOrders.filter(o => o.status === 'Completed').length
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
                        id: Number(Date.now() + i),
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
                    id: Number(Date.now()),
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
                    id: Number(Date.now().toString() + idx),
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
        <div className="flex flex-col w-full relative flex-1 animate-fade-in-up">
            <PageHeader
                Icon={ArrowDownToLine}
                title="WAREHOUSE OUT"
                subtitle="รายการส่งมอบสินค้า & เบิกวัตถุดิบ"
            />

            <main className="flex-1 relative z-10 pt-4 flex flex-col gap-6 no-print">
                <OutboundKpiSection stats={stats} />

                <div className="flex flex-col relative gap-4 min-h-[500px]">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden z-20">
                        <OutboundToolbar 
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            activeWhTab={activeWhTab}
                            setActiveWhTab={setActiveWhTab}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onUploadClick={() => setShowUploadModal(true)}
                            onOutboundClick={() => openOutboundModal(null, 'MANUAL')}
                            warehouses={WAREHOUSES}
                            statuses={STATUSES}
                            getStatusCount={getStatusCount}
                        />
                    </div>

                    <div className="flex-1 overflow-hidden">
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
                                className="py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 group flex flex-col gap-0.5">
                                <div className="text-[11px] font-black text-[#111f42] group-hover:text-[#111f42] font-mono">{p.sku}</div>
                                <div className="text-[10px] text-slate-500 font-medium truncate">{p.name}</div>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
}
