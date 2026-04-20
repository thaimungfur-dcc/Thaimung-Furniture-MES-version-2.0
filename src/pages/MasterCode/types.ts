export interface MasterItem {
  id: string;
  mastCode: string;
  groups: string[];
  category: string;
  catCode: string;
  subCategory: string;
  subCatCode: string;
  note: string;
  updatedAt: string;
  updatedBy: string;
}

export const getTypeClass = (type: string) => {
  switch(type) {
    case 'FG': return 'bg-[#111f42]/10 text-[#111f42] border-[#111f42]/20'; 
    case 'RM': return 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20'; 
    case 'HW': return 'bg-[#ab8a3b]/10 text-[#ab8a3b] border-[#ab8a3b]/20'; 
    case 'FB': return 'bg-[#E3624A]/10 text-[#E3624A] border-[#E3624A]/20'; 
    case 'PK': return 'bg-[#4e546a]/10 text-[#4e546a] border-[#4e546a]/20'; 
    default: return 'bg-slate-100 text-slate-500 border-slate-200';
  }
};
