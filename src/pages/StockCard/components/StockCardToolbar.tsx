import React from 'react';
import { Search, X, Filter, ChevronDown, Printer } from 'lucide-react';

interface StockCardToolbarProps {
  itemSearchText: string;
  setItemSearchText: (val: string) => void;
  setIsItemDropdownOpen: (val: boolean) => void;
  isItemDropdownOpen: boolean;
  handleClearSearch: () => void;
  filteredItems: any[];
  handleItemSelect: (item: any) => void;
  viewState: { itemId: string; lotId: string };
  setViewState: (val: any) => void;
  availableLots: any[];
  onExportClick: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export const StockCardToolbar: React.FC<StockCardToolbarProps> = ({
  itemSearchText,
  setItemSearchText,
  setIsItemDropdownOpen,
  isItemDropdownOpen,
  handleClearSearch,
  filteredItems,
  handleItemSelect,
  viewState,
  setViewState,
  availableLots,
  onExportClick,
  dropdownRef
}) => {
  return (
    <div className="p-5 border-b border-slate-100 bg-slate-50/30 relative z-[100] overflow-visible">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
        <div className="md:col-span-5 relative" ref={dropdownRef}>
          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Select Product from Item Master</label>
          <div className="relative h-10 group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ab8a3b] transition-colors" />
            <input 
              type="text" 
              value={itemSearchText} 
              onChange={(e) => {setItemSearchText(e.target.value); setIsItemDropdownOpen(true);}}
              onFocus={() => setIsItemDropdownOpen(true)}
              placeholder="Search SKU or Name..." 
              className="w-full h-full bg-white border-2 border-slate-200 rounded-xl pl-10 pr-10 text-[10px] font-black uppercase tracking-widest text-[#111f42] outline-none focus:border-[#ab8a3b] transition-all shadow-sm placeholder:opacity-40"
            />
            {itemSearchText && (
              <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#E3624A] transition-colors"><X size={14}/></button>
            )}
          </div>
          {isItemDropdownOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-[1000] mt-1 max-h-[250px] overflow-y-auto master-custom-scrollbar animate-in slide-in-from-top-2 duration-200">
              {filteredItems.map(item => (
                <div key={item.id} onClick={() => handleItemSelect(item)} className="px-5 py-4 cursor-pointer border-b border-slate-50 hover:bg-slate-50 transition-all flex flex-col gap-1">
                  <div className="text-[11px] font-black text-[#111f42] font-mono tracking-wider uppercase">{item.id}</div>
                  <div className="text-[9px] text-[#ab8a3b] font-black uppercase tracking-widest opacity-70">{item.name}</div>
                </div>
              ))}
              {filteredItems.length === 0 && <div className="p-8 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] italic">No matching items found</div>}
            </div>
          )}
        </div>
        <div className="md:col-span-3">
          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Lot Tracking</label>
          <div className="relative h-10 group">
            <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ab8a3b] group-focus-within:text-[#111f42] transition-colors" />
            <select 
              value={viewState.lotId} 
              onChange={(e) => setViewState({...viewState, lotId: e.target.value, page: 1})}
              disabled={!viewState.itemId}
              className="w-full h-full bg-white border-2 border-slate-200 rounded-xl pl-10 pr-8 text-[10px] font-black text-[#111f42] outline-none focus:border-[#ab8a3b] appearance-none disabled:bg-slate-50/50 disabled:text-slate-300 cursor-pointer uppercase tracking-[0.15em] transition-all"
            >
              <option value="">ALL LOT NUMBERS</option>
              {availableLots.map(lot => <option key={lot} value={lot as string}>{lot as string}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="md:col-span-4 flex justify-end gap-2">
          <button onClick={onExportClick} className="h-10 px-8 rounded-xl bg-[#111f42] text-[#ab8a3b] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#0a1229] transition-all flex items-center gap-3 font-mono border-b-2 border-[#ab8a3b]">
            <Printer size={16} /> EXPORT LEDGER
          </button>
        </div>
      </div>
    </div>
  );
};
