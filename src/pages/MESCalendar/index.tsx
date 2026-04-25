import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Clock, 
  List, 
  LayoutGrid, 
  HelpCircle, 
  X, 
  Eye, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  CalendarDays, 
  PlusCircle, 
  ChevronsLeft, 
  ChevronsRight, 
  Settings, 
  ShoppingCart, 
  Truck, 
  CheckSquare, 
  Package, 
  Coins, 
  TrendingUp, 
  ArrowUpRight, 
  Phone, 
  Mail,
  Palmtree,
  Factory
} from 'lucide-react';
import EventModal from './components/EventModal';
import GuideDrawer from './components/GuideDrawer';

export default function MESCalendar() {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'list'
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 15)); // Default to March 2026
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Event Management States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
  
  // Pagination States for List View
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Initial Events with Thai Holidays & Factory Schedule
  const [events, setEvents] = useState([
    // Thai Public Holidays 2026
    { id: 'HL-001', date: '2026-01-01', title: '*วันขึ้นปีใหม่', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-002', date: '2026-04-06', title: '*วันจักรี', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-003', date: '2026-04-13', title: '*วันสงกรานต์', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-004', date: '2026-04-14', title: '*วันสงกรานต์', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-005', date: '2026-04-15', title: '*วันสงกรานต์', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-006', date: '2026-05-01', title: '*วันแรงงานแห่งชาติ', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-007', date: '2026-06-03', title: '*วันเฉลิมพระชนมพรรษาสมเด็จพระนางเจ้าฯ พระบรมราชินี', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-008', date: '2026-07-28', title: '*วันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระเจ้าอยู่หัว', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-009', date: '2026-08-12', title: '*วันแม่แห่งชาติ', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-010', date: '2026-10-13', title: '*วันนวมินทรมหาราช', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-011', date: '2026-10-23', title: '*วันปิยมหาราช', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-012', date: '2026-12-05', title: '*วันพ่อแห่งชาติ (วันชาติ)', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-013', date: '2026-12-10', title: '*วันรัฐธรรมนูญ', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    { id: 'HL-014', date: '2026-12-31', title: '*วันสิ้นปี', time: 'All Day', type: 'Holiday', priority: 'High', status: 'Confirmed', color: 'bg-red-100 text-red-700 border-red-200', isHoliday: true },
    
    // Furniture Factory Mock Data
    { id: 'EV-001', date: '2026-03-09', title: 'Monthly QC Audit', time: '09:00', type: 'QC', priority: 'High', status: 'Scheduled', color: 'bg-purple-100 text-purple-700 border-purple-200', isHoliday: false },
    { id: 'EV-002', date: '2026-03-12', title: 'PM: CNC Router M-04', time: '13:00', type: 'Maintenance', priority: 'Critical', status: 'Confirmed', color: 'bg-amber-100 text-amber-700 border-amber-200', isHoliday: false },
    { id: 'EV-003', date: '2026-03-15', title: 'Teak Wood Batch Arrival', time: '10:00', type: 'Logistics', priority: 'Normal', status: 'Scheduled', color: 'bg-teal-100 text-teal-700 border-teal-200', isHoliday: false },
    { id: 'EV-004', date: '2026-03-18', title: 'Prod: Leather Sofa Lot 45', time: '08:00', type: 'Production', priority: 'High', status: 'Confirmed', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', isHoliday: false },
    { id: 'EV-005', date: '2026-03-20', title: 'Shift Supervisor Meeting', time: '15:30', type: 'Meeting', priority: 'Normal', status: 'Confirmed', color: 'bg-slate-100 text-slate-700 border-slate-200', isHoliday: false },
  ]);

  const [eventForm, setEventForm] = useState({
    id: '', date: '', title: '', time: '', type: 'Production', priority: 'Normal', status: 'Scheduled', isHoliday: false
  });

  // Furniture MES Theme Colors
  const theme = {
    primary: '#111f42',     // Navy
    accent: '#E3624A',      // Terracotta
    gold: '#ab8a3b',        // Gold
    sunday: '#e11d48',      // Rose
    saturday: '#a98ab6',    // Lavender Purple
    bg: '#F9F7F6'           // Neutral Bg
  };

  const daysOfWeek = [
    { label: 'SUN', color: theme.sunday },
    { label: 'MON', color: theme.primary },
    { label: 'TUE', color: theme.primary },
    { label: 'WED', color: theme.primary },
    { label: 'THU', color: theme.primary },
    { label: 'FRI', color: theme.primary },
    { label: 'SAT', color: theme.saturday }
  ];

  // Calendar Logic
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push({ day: null, dateStr: '', isToday: false, isWeekend: false });
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ 
        day: i, 
        dateStr,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        isWeekend: (new Date(year, month, i).getDay() === 0 || new Date(year, month, i).getDay() === 6)
      });
    }
    return days;
  }, [currentDate]);

  // Filtering Logic
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.type.toLowerCase().includes(searchQuery.toLowerCase());
      const evMonth = ev.date.substring(0, 7);
      const currMonth = currentDate.toISOString().substring(0, 7);
      return matchSearch && (activeTab === 'list' ? true : evMonth === currMonth);
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, searchQuery, currentDate, activeTab]);

  // Pagination Logic
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;

  // Handlers
  const handlePrevMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)); setCurrentPage(1); };
  const handleNextMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)); setCurrentPage(1); };
  const handleSetToday = () => { setCurrentDate(new Date()); setCurrentPage(1); };

  const openEventModal = (mode: string, data: any = null, type = 'Event') => {
    setModalMode(mode);
    if (mode === 'create') {
      const isHolidays = type === 'Holiday';
      setEventForm({
        id: isHolidays ? `HL-${String(events.length + 1).padStart(3, '0')}` : `EV-${String(events.length + 1).padStart(3, '0')}`,
        date: data?.dateStr || new Date().toISOString().split('T')[0],
        title: isHolidays ? '*' : '',
        time: isHolidays ? 'All Day' : '08:00',
        type: isHolidays ? 'Holiday' : 'Production',
        priority: isHolidays ? 'High' : 'Normal',
        status: 'Scheduled',
        isHoliday: isHolidays
      });
    } else {
      setEventForm({ ...data });
    }
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.date) return;
    
    let processedTitle = eventForm.title;
    if (eventForm.isHoliday && !processedTitle.startsWith('*')) {
      processedTitle = '*' + processedTitle;
    }

    const typeColors: Record<string, string> = {
      'Production': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Maintenance': 'bg-amber-100 text-amber-700 border-amber-200',
      'Logistics': 'bg-teal-100 text-teal-700 border-teal-200',
      'QC': 'bg-purple-100 text-purple-700 border-purple-200',
      'Meeting': 'bg-slate-100 text-slate-700 border-slate-200',
      'Holiday': 'bg-red-100 text-red-700 border-red-200'
    };

    if (modalMode === 'create') {
      const newEntry = { 
        ...eventForm, 
        title: processedTitle,
        color: typeColors[eventForm.type] || 'bg-slate-100 text-slate-700 border-slate-200' 
      };
      setEvents([...events, newEntry]);
    } else {
      setEvents(events.map(e => e.id === eventForm.id ? { ...eventForm, title: processedTitle, color: typeColors[eventForm.type] || e.color } : e));
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage, activeTab]);

  return (
    <>
      <style>{`
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); }
        .day-cell { min-height: 120px; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
        .day-cell:nth-child(7n) { border-right: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .data-table th { border-bottom: 4px solid #E3624A; }
      `}</style>

      <div className="flex flex-col pt-8 pb-10">
        <PageHeader
          title="MES CALENDAR"
          subtitle="Factory Schedule & Maintenance Planning"
          icon={CalendarIcon}
          rightContent={
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner w-full md:w-fit flex-shrink-0 rounded-xl overflow-hidden">
                <button onClick={() => setActiveTab('calendar')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-wide rounded-lg ${activeTab === 'calendar' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <LayoutGrid size={14} /> CALENDAR
                </button>
                <button onClick={() => setActiveTab('list')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-wide rounded-lg ${activeTab === 'list' ? 'bg-[#1e293b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <List size={14} /> EVENT LIST
                </button>
              </div>
              <button onClick={() => setIsGuideOpen(true)} className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm"><HelpCircle size={20} /></button>
            </div>
          }
        />

        {/* MAIN CONTAINER */}
        <div className="bg-white shadow-sm flex flex-col rounded-none animate-in fade-in duration-500 overflow-visible">
          
          {/* INTEGRATED ACTION BAR */}
          <div className="p-4 flex flex-wrap items-center justify-between gap-4 bg-white border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"><ChevronLeft size={20}/></button>
                <div className="px-4 text-[18px] font-black text-[#111f42] uppercase tracking-widest min-w-[180px] text-center">
                  {currentDate?.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"><ChevronRight size={20}/></button>
              </div>
              <button onClick={handleSetToday} className="px-5 py-2 bg-slate-50 border border-slate-200 text-[#111f42] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all text-[11px]">Today</button>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-end max-w-4xl">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search Events..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 outline-none focus:border-[#111f42] text-slate-700 font-medium text-[12px] shadow-sm transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={() => openEventModal('create', null, 'Event')} className="flex items-center gap-2 px-5 py-2.5 bg-[#111f42] text-white font-black uppercase tracking-widest rounded-xl shadow-md hover:opacity-90 transition-all text-[11px]">
                  <Plus size={16} strokeWidth={3} className="text-white" /> Add Event
                </button>
                <button onClick={() => openEventModal('create', null, 'Holiday')} className="flex items-center gap-2 px-5 py-2.5 bg-[#E3624A] text-white font-black uppercase tracking-widest rounded-xl shadow-md hover:opacity-90 transition-all text-[11px]">
                  <Palmtree size={16} strokeWidth={2.5} className="text-white" /> Add Holiday
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          {activeTab === 'calendar' ? (
            <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
              <div className="calendar-grid border-b border-slate-200 sticky top-0 z-10">
                {daysOfWeek.map((day, idx) => (
                  <div 
                    key={idx} 
                    style={{ backgroundColor: day.color }}
                    className="py-3 text-center text-[11px] font-black tracking-[0.2em] text-white"
                  >
                    {day.label}
                  </div>
                ))}
              </div>
              <div className="calendar-grid">
                {calendarDays.map((d, idx) => {
                  const dayEvents = events.filter(e => e.date === d.dateStr);
                  const isSunday = idx % 7 === 0;
                  const isSaturday = idx % 7 === 6;

                  return (
                    <div 
                      key={idx} 
                      className={`day-cell p-2 transition-colors relative group ${!d.day ? 'bg-slate-50/50' : 'bg-white hover:bg-slate-50/50'} ${isSunday && d.day ? 'bg-rose-50/20' : ''} ${isSaturday && d.day ? 'bg-[#a98ab6]/10' : ''}`}
                    >
                      {d.day && (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <span className={`w-7 h-7 flex items-center justify-center rounded-full font-black text-[13px] ${d.isToday ? 'bg-[#E3624A] text-white shadow-md' : 'text-slate-600'} ${isSunday && !d.isToday ? 'text-[#E3624A]' : ''} ${isSaturday && !d.isToday ? 'text-[#a98ab6]' : ''}`}>{d.day}</span>
                          </div>
                          <div className="space-y-1 overflow-y-auto max-h-[85px] no-scrollbar">
                            {dayEvents.map((ev, i) => (
                              <div 
                                key={i} 
                                onClick={() => openEventModal('edit', ev)} 
                                className={`px-2 py-1 rounded-md text-[9px] font-bold border truncate shadow-sm cursor-pointer hover:brightness-95 transition-all ${ev.color}`}
                              >
                                {ev.title}
                              </div>
                            ))}
                          </div>
                          
                          <button 
                            onClick={() => openEventModal('create', d, 'Event')}
                            className="absolute bottom-2 right-2 w-6 h-6 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-400 hover:text-[#111f42] hover:border-[#111f42] opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <Plus size={14} strokeWidth={2.5} />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap data-table">
                  <thead className="bg-[#111f42] text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">ID</th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">DATE & TIME</th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">TITLE</th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">CATEGORY</th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-center">PRIORITY</th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-center">STATUS</th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {paginatedEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 font-black text-slate-400 font-mono text-[12px]">{ev.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-[#111f42] uppercase text-[12px]">{new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <span className="text-[10px] text-slate-400 font-mono font-black flex items-center gap-1 uppercase tracking-widest"><Clock size={10}/> {ev.time}</span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 font-black text-[13px] uppercase tracking-tight ${ev.isHoliday ? 'text-[#E3624A]' : 'text-[#111f42]'}`}>{ev.title}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-none text-[9px] font-black border uppercase tracking-widest ${ev.color}`}>{ev.type}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded-none text-[9px] font-black uppercase tracking-widest border ${ev.priority === 'High' || ev.priority === 'Critical' ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{ev.priority}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-slate-600 uppercase tracking-widest font-mono">
                             {ev.status === 'Completed' ? <CheckCircle2 size={14} className="text-emerald-500"/> : <div className="w-2 h-2 rounded-none bg-[#3b82f6] animate-pulse"/>}
                             {ev.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => openEventModal('view', ev)} className="p-1.5 text-[#3b82f6] hover:bg-blue-50 rounded-none transition-colors border border-transparent hover:border-blue-100"><Eye size={16}/></button>
                            <button onClick={() => openEventModal('edit', ev)} className="p-1.5 text-[#ab8a3b] hover:bg-amber-50 rounded-none transition-colors border border-transparent hover:border-amber-100"><Pencil size={16}/></button>
                            <button onClick={() => handleDeleteEvent(ev.id)} className="p-1.5 text-[#E3624A] hover:bg-red-50 rounded-none transition-colors border border-transparent hover:border-red-100"><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedEvents.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic font-black uppercase tracking-widest text-[11px] bg-slate-50/10">No matching events found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION SECTION */}
              <div className="px-6 py-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <p>Showing <span className="font-bold text-[#111f42]">{filteredEvents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-[#111f42]">{Math.min(currentPage * itemsPerPage, filteredEvents.length)}</span> of <span className="font-bold text-[#111f42]">{filteredEvents.length}</span> entries</p>
                  <select 
                    value={itemsPerPage} 
                    onChange={e => setItemsPerPage(Number(e.target.value))} 
                    className="bg-white border border-slate-200 rounded px-2 py-1 outline-none text-[10px] font-bold cursor-pointer hover:border-[#111f42] transition-colors"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-slate-200 rounded-none shadow-sm overflow-hidden">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2.5 hover:bg-slate-50 disabled:opacity-30 text-slate-600 border-r border-slate-100 transition-colors"><ChevronsLeft size={16} /></button>
                    <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-2.5 hover:bg-slate-50 disabled:opacity-30 text-slate-600 border-r border-slate-100 transition-colors"><ChevronLeft size={16} /></button>
                    <div className="flex px-1 items-center gap-1 bg-slate-50/30">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (totalPages > 5) { if (pageNum > currentPage + 2 || pageNum < currentPage - 2) return null; }
                        return (
                          <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded-none text-[10px] font-black transition-all font-mono ${currentPage === pageNum ? 'bg-[#111f42] text-white shadow-md scale-105 border border-[#111f42]' : 'text-slate-500 hover:bg-white hover:text-[#111f42]'}`}>{pageNum}</button>
                        );
                      })}
                    </div>
                    <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="p-2.5 hover:bg-slate-50 disabled:opacity-30 text-slate-600 border-l border-slate-100 transition-colors"><ChevronRight size={16} /></button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2.5 hover:bg-slate-50 disabled:opacity-30 text-slate-600 border-l border-slate-100 transition-colors"><ChevronsRight size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD / EDIT / VIEW */}
      {isModalOpen && (
        <EventModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          mode={modalMode} 
          setMode={setModalMode}
          eventForm={eventForm} 
          setEventForm={setEventForm} 
          onSave={handleSaveEvent} 
        />
      )}

      {/* User Guide Drawer */}
      {isGuideOpen && (
        <GuideDrawer isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      )}
    </>
  );
}
