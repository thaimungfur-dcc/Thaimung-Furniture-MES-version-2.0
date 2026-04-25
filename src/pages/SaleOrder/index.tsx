import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Calendar, Kanban, FileText, HelpCircle } from 'lucide-react';
import { MASTER_CUSTOMERS, MASTER_PRODUCTS, STATUS_LIST, THEME } from './constants';
import { calculateTotals } from './utils';
import { Order } from './types';
import { PageHeader } from '../../components/shared/PageHeader';
import KanbanBoard from './components/KanbanBoard';
import OrdersTable from './components/OrdersTable';
import OrderModal from './components/OrderModal';
import GuidePanel from './components/GuidePanel';
import ConfigModal from './components/ConfigModal';
import PreviewModal from './components/PreviewModal';

export default function SaleOrder() {
  const [mainTab, setMainTab] = useState('kanban'); // 'orders' | 'kanban'
  const [subTab, setSubTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Kanban Expand State
  const [expandedCols, setExpandedCols] = useState<Record<string, boolean>>({});

  // Modal & Slide-out States
  const [orderModal, setOrderModal] = useState<{ mode: string; data: Order } | null>(null); 
  const [configModal, setConfigModal] = useState(false);
  const [previewModal, setPreviewModal] = useState<{ type: string; data?: Order } | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('Order Info');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [idConfig, setIdConfig] = useState({
    format: 'SO{YY}{MM}{DD}-{SEQ}',
    reset: 'Daily'
  });

  // Load Extensive Mock Data with Multiple Months and 3-5 items per SO
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const generatedMocks: Order[] = [];
      const targetMonths = ['2026-01', '2026-02', '2026-03', '2026-04'];
      
      // Generate 60 comprehensive records spreading across 4 months
      for (let i = 1; i <= 60; i++) {
        const monthIdx = i % 4; 
        const monthStr = targetMonths[monthIdx];
        const day = String((i % 28) + 1).padStart(2, '0');
        const dateStr = `${monthStr}-${day}`;
        const cIdx = i % MASTER_CUSTOMERS.length;
        const sIdx = i % STATUS_LIST.length;
        
        // Randomly generate 3 to 5 items
        const numItems = (i % 3) + 3;
        const items = [];
        
        for(let j=0; j < numItems; j++) {
          const pIdx = (i + j) % MASTER_PRODUCTS.length;
          const qty = (j % 5) + 2; // Quantity between 2 to 6
          
          let deliveries = [];
          // Apply split delivery randomly to test UI
          if (j % 2 === 0 && qty > 2) {
            const split1 = Math.floor(qty / 2);
            const split2 = qty - split1;
            deliveries = [
              { round: 1, date: `${monthStr}-${String((Number(day)+2)%28+1).padStart(2,'0')}`, qty: split1 },
              { round: 2, date: `${monthStr}-${String((Number(day)+5)%28+1).padStart(2,'0')}`, qty: split2 }
            ];
          } else {
            deliveries = [{ round: 1, date: `${monthStr}-${String((Number(day)+3)%28+1).padStart(2,'0')}`, qty: qty }];
          }

          items.push({
            sku: MASTER_PRODUCTS[pIdx].sku,
            name: MASTER_PRODUCTS[pIdx].name,
            qty: qty,
            price: MASTER_PRODUCTS[pIdx].price,
            discount: j === 1 ? 500 : 0, // apply some discount to the second item
            deliveries: deliveries
          });
        }

        generatedMocks.push({
          id: i,
          soNumber: `SO${monthStr.replace('-','').substring(2)}${day}-${String(i).padStart(3,'0')}`,
          date: dateStr,
          customer: MASTER_CUSTOMERS[cIdx],
          salesPerson: i % 2 === 0 ? 'Admin' : 'Jane Smith',
          status: STATUS_LIST[sIdx],
          vatType: i % 3 === 0 ? 'Incl.' : 'Excl.',
          vatRate: 7,
          items: items
        });
      }

      // Auto calculate grand total for all mock orders to ensure 100% accuracy
      const accurateMockData = generatedMocks?.map(order => {
        const totals = calculateTotals(order);
        return { ...order, total: totals.grandTotal };
      });

      setOrders(accurateMockData.sort((a,b) => b.id - a.id));
      setLoading(false);
    }, 500);
  }, []);

  // Auto SO Number Calculation
  const currentSONumber = useMemo(() => {
    const seq = String(orders.length + 1).padStart(3, '0');
    return idConfig.format.replace('{YY}', '26').replace('{MM}', '03').replace('{DD}', '12').replace('{SEQ}', seq);
  }, [idConfig.format, orders.length]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    let result = orders;
    if (subTab !== 'all') result = result.filter(o => o.status === subTab);
    if (selectedMonth) result = result.filter(o => o.date.startsWith(selectedMonth));
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(o => (o.soNumber||'').toLowerCase().includes(q) || (o.customer||'').toLowerCase().includes(q));
    }
    return result;
  }, [orders, subTab, searchTerm, selectedMonth]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, subTab, searchTerm]);

  // Handlers
  const toggleColumnExpand = (status: string) => {
    setExpandedCols(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const openModal = (mode = 'create', data: Order | null = null) => {
    const defaultDate = new Date().toISOString().split('T')[0];
    const initialData: Order = data ? JSON.parse(JSON.stringify(data)) : {
      id: Date.now(),
      soNumber: currentSONumber,
      customer: '',
      date: defaultDate,
      salesPerson: 'Admin',
      status: 'Booking',
      vatType: 'Excl.',
      vatRate: 7,
      items: [{ sku: '', name: '', qty: 1, price: 0, discount: 0, deliveries: [{ round: 1, date: defaultDate, qty: 1 }] }],
      note: ''
    };
    setOrderModal({ mode, data: initialData });
    setActiveModalTab('Order Info');
  };

  const saveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModal) return;
    const totals = calculateTotals(orderModal.data);
    const orderToSave = { ...orderModal.data, total: totals.grandTotal, id: orderModal.mode === 'create' ? Date.now() : orderModal.data.id };
    if (orderModal.mode === 'create') setOrders([orderToSave, ...orders]);
    else setOrders(orders?.map(o => o.id === orderToSave.id ? orderToSave : o));
    setOrderModal(null);
  };

  const updateOrderStatus = (id: number, newStatus: string) => {
    setOrders(orders?.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  // Delivery Handlers
  const addDeliveryRound = (itemIdx: number) => {
    if (!orderModal || orderModal.mode === 'view') return;
    const newItems = [...orderModal.data.items];
    const item = newItems[itemIdx];
    const nextRound = item.deliveries.length + 1;
    item.deliveries.push({ round: nextRound, date: orderModal.data.date, qty: 1 });
    setOrderModal({...orderModal, data: {...orderModal.data, items: newItems}});
  };

  const updateDeliveryRound = (itemIdx: number, deliveryIdx: number, field: string, value: any) => {
    if (!orderModal || orderModal.mode === 'view') return;
    const newItems = [...orderModal.data.items];
    newItems[itemIdx].deliveries[deliveryIdx] = { ...newItems[itemIdx].deliveries[deliveryIdx], [field]: value };
    setOrderModal({...orderModal, data: {...orderModal.data, items: newItems}});
  };

  const removeDeliveryRound = (itemIdx: number, deliveryIdx: number) => {
    if (!orderModal || orderModal.mode === 'view') return;
    const newItems = [...orderModal.data.items];
    newItems[itemIdx].deliveries = newItems[itemIdx].deliveries.filter((_, i) => i !== deliveryIdx);
    newItems[itemIdx].deliveries.forEach((del, i) => del.round = i + 1);
    setOrderModal({...orderModal, data: {...orderModal.data, items: newItems}});
  };

  return (
    <>
      <style>{`
        .kanban-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .kanban-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        @media print {
          @page { size: A4 portrait; margin: 10mm; } 
          body { background-color: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
        }
        .print-only { display: none; }
      `}</style>
      
      <div className="pt-8 pb-10 transition-colors duration-500 text-[12px] flex flex-col font-light">
        <div className="w-full space-y-6 relative flex-1 flex flex-col">
          
          <PageHeader
            title="SALES ORDER"
            subtitle="ระบบบริหารจัดการใบสั่งขายและรอบจัดส่ง"
            icon={ShoppingBag}
            iconColor="text-[#E3624A]"
            rightContent={
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-500">
                      <Calendar size={14} />
                    </div>
                    <input 
                      type="month" 
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-3 py-2 text-[12px] font-semibold text-[#111f42] outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                    />
                  </div>

                  <div className="flex bg-white p-1 border border-slate-200 shadow-sm rounded-lg overflow-hidden flex-shrink-0">
                    <button onClick={() => setMainTab('kanban')} className={`px-5 py-2.5 font-normal transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] ${mainTab === 'kanban' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><Kanban size={14} /> BOARD</button>
                    <button onClick={() => setMainTab('orders')} className={`px-5 py-2.5 font-normal transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] ${mainTab === 'orders' ? 'bg-[#E3624A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><FileText size={14} /> ORDERS</button>
                  </div>
                  <button 
                    onClick={() => setIsGuideOpen(true)} 
                    className="flex items-center justify-center p-2.5 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#111f42] rounded-lg transition-all border border-slate-200 shadow-sm"
                    title="คู่มือการใช้งาน (Guide)"
                  >
                    <HelpCircle size={18} />
                  </button>
                </div>
              </div>
            }
          />

          {mainTab === 'kanban' && (
            <KanbanBoard 
              filteredOrders={filteredOrders}
              expandedCols={expandedCols}
              toggleColumnExpand={toggleColumnExpand}
              openModal={openModal}
              setPreviewModal={setPreviewModal}
            />
          )}

          {mainTab === 'orders' && (
            <OrdersTable 
              subTab={subTab}
              setSubTab={setSubTab}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setCurrentPage={setCurrentPage}
              setConfigModal={setConfigModal}
              setPreviewModal={setPreviewModal}
              openModal={openModal}
              currentItems={currentItems}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}

          {orderModal && (
            <OrderModal 
              orderModal={orderModal}
              setOrderModal={setOrderModal}
              activeModalTab={activeModalTab}
              setActiveModalTab={setActiveModalTab}
              setConfigModal={setConfigModal}
              saveOrder={saveOrder}
              addDeliveryRound={addDeliveryRound}
              updateDeliveryRound={updateDeliveryRound}
              removeDeliveryRound={removeDeliveryRound}
            />
          )}

          <GuidePanel isGuideOpen={isGuideOpen} setIsGuideOpen={setIsGuideOpen} />

          <ConfigModal 
            configModal={configModal}
            setConfigModal={setConfigModal}
            idConfig={idConfig}
            setIdConfig={setIdConfig}
            currentSONumber={currentSONumber}
          />

          <PreviewModal 
            previewModal={previewModal}
            setPreviewModal={setPreviewModal}
            filteredOrders={filteredOrders}
          />

        </div>
      </div>
    </>
  );
}
