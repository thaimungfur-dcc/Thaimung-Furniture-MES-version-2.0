import React, { useState, useRef } from 'react';
import { 
  QrCode, List, BarChart2, Database, Package, Leaf, PlusCircle, 
  UploadCloud, Plus, HelpCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { MasterItem } from './types';
import { KpiCard } from '../../components/shared/KpiCard';
import { PageHeader } from '../../components/shared/PageHeader';
import MasterList from './components/MasterList';
import Analytics from './components/Analytics';
import MasterModal from './components/MasterModal';
import { CsvUploadModal } from '../../components/shared/CsvUploadModal';
import GroupModal from './components/GroupModal';
import GuideDrawer from './components/GuideDrawer';
import { useGoogleSheets } from '../../hooks/useGoogleSheets';

export default function MasterCodeApp() {
  const { data: items, addRow: addItem, addMultipleRows, updateRow: updateItem, updateMultipleRows, deleteRow: deleteItem, loading: isLoading, progress: uploadProgress } = useGoogleSheets<MasterItem>('MasterCodes');
  const [activeTab, setActiveTab] = useState('list');
  const [showModal, setShowModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  const [groups, setGroups] = useState(['All', 'FG', 'RM', 'HW', 'FB', 'PK']);
  const [newGroup, setNewGroup] = useState('');
  
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editGroupText, setEditGroupText] = useState('');

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [form, setForm] = useState<any>({
    id: null,
    groups: [],
    category: '',
    catCode: '',
    subCategory: '',
    subCatCode: '',
    note: ''
  });

  const totalCount = items?.length || 0;
  const fgCount = (items || [])?.filter(i => i.groups && i.groups.some(g => g?.toUpperCase() === 'FG')).length;
  const rmCount = (items || [])?.filter(i => i.groups && i.groups.some(g => ['RM', 'HW', 'FB'].includes(g?.toUpperCase()))).length;
  
  const newCount = (items || [])?.filter(i => {
    if (!i.updatedAt) return false;
    const d = new Date(i.updatedAt);
    return !isNaN(d.getTime()) && d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
  }).length;

  const generatedMastCode = ((form.catCode || '') + (form.subCatCode || '')).toUpperCase();
  
  const isDuplicate = form.catCode && form.subCatCode ? (items || [])?.some(i => i.mastCode === generatedMastCode && i.id !== form.id) : false;

  const isValid = form.groups.length > 0 && form.category && form.catCode.length === 2 && form.subCategory && form.subCatCode.length === 2;

  const openModal = (item: MasterItem | null = null) => {
    if (item) {
      setForm({ ...item, groups: item.groups || [] });
    } else {
      setForm({ id: null, groups: [], category: '', catCode: '', subCategory: '', subCatCode: '', note: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);
  const openGroupManager = () => setShowGroupModal(true);

  const toggleGroupInForm = (g: string) => {
    setForm((prev: any) => {
      if (prev.groups && prev.groups.includes(g)) return { ...prev, groups: prev.groups?.filter((x: string) => x !== g) };
      return { ...prev, groups: [...(prev.groups || []), g] };
    });
  };

  const saveItem = async () => {
    if (!isValid) return;
    
    if (isDuplicate) {
      Swal.fire({
        icon: 'warning',
        title: 'รหัสซ้ำซ้อน (Duplicate Code)',
        text: `รหัส "${generatedMastCode}" มีอยู่ในระบบแล้ว กรุณาตรวจสอบข้อมูลอีกครั้ง`,
        confirmButtonColor: '#111f42'
      });
      return;
    }

    const now = new Date().toISOString();
    const code = generatedMastCode;
    
    try {
      if (form.id) {
        await updateItem(form.id, { ...form, mastCode: code, updatedAt: now });
        Swal.fire({ icon: 'success', title: 'Updated Successfully', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      } else {
        await addItem({ ...form, mastCode: code, updatedAt: now, updatedBy: 'Admin User' });
        Swal.fire({ icon: 'success', title: 'Created Successfully', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      }
      closeModal();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Save Failed', text: error.message });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Master Code?')) {
      await deleteItem(id);
    }
  };

  const addGroup = () => {
    if (newGroup && !groups.includes(newGroup.toUpperCase())) {
      setGroups(prev => [...prev, newGroup.toUpperCase()]);
      setNewGroup('');
    }
  };

  const removeGroup = (g: string) => {
    if(window.confirm(`Delete group ${g}?`)) {
      setGroups(prev => prev?.filter(x => x !== g));
    }
  };

  const startEditGroup = (g: string) => {
    setEditingGroup(g);
    setEditGroupText(g);
  };

  const cancelEditGroup = () => {
    setEditingGroup(null);
    setEditGroupText('');
  };

  const saveEditGroup = async () => {
    if (editGroupText && !groups.includes(editGroupText.toUpperCase())) {
      const oldGroup = editingGroup;
      const newName = editGroupText.toUpperCase();
      
      setGroups(prev => prev?.map(g => g === oldGroup ? newName : g));
      
      const itemsToUpdate = (items || [])
        .filter(item => item.groups && item.groups.includes(oldGroup!))
        .map(item => ({
          id: item.id,
          groups: item.groups?.map((g: string) => g === oldGroup ? newName : g) || []
        }));

      if (itemsToUpdate.length > 0) {
        try {
          await updateMultipleRows(itemsToUpdate);
          Swal.fire({ 
            icon: 'success', 
            title: 'Master Data Sync', 
            text: `Successfully updated ${itemsToUpdate.length} items in Google Sheets.`,
            timer: 2000, 
            showConfirmButton: false 
          });
        } catch (error: any) {
          Swal.fire({ icon: 'error', title: 'Sync Error', text: error.message });
        }
      }
      
      cancelEditGroup();
    } else if (editGroupText === editingGroup) {
      cancelEditGroup();
    } else {
      alert('Invalid Name: Group name is empty or already exists.');
    }
  };

  const processUploadData = async (parsedData: any[]) => {
    if (!parsedData || parsedData.length === 0) return;
    
    const newItems = [];
    let duplicateCount = 0;
    const existingCodes = new Set((items || []).map(i => i.mastCode.toUpperCase()));

    for (let idx = 0; idx < parsedData.length; idx++) {
      const row = parsedData[idx];
      const getVal = (r: any, keys: string[]) => {
        for (const k of Object.keys(r)) {
          const cleanK = k.toLowerCase().replace(/\s/g, '');
          if (keys.includes(cleanK)) return r[k] == null ? '' : r[k];
        }
        return '';
      };
      
      const catCodeStr = getVal(row, ['catcode', 'code', 'categorycode', 'cat']);
      const subCatCodeStr = getVal(row, ['subcode', 'subcatcode', 'subcategorycode', 'sub']);
      
      const catCode = catCodeStr.toString().trim().toUpperCase().substring(0,2);
      const subCatCode = subCatCodeStr.toString().trim().toUpperCase().substring(0,2);
      
      if (!catCode || !subCatCode) continue;

      const mastCode = (catCode + subCatCode).toUpperCase();
      
      // Check for duplicates in existing data or within the current batch
      if (existingCodes.has(mastCode)) {
        duplicateCount++;
        continue;
      }

      const groupStr = getVal(row, ['group', 'mastergroup', 'grp']);
      const group = groupStr ? groupStr.toString().trim().toUpperCase() : 'Uncategorized';

      newItems.push({
        id: (Date.now() + idx).toString(),
        mastCode: mastCode,
        groups: [group],
        category: getVal(row, ['category', 'catname', 'categoryname']) || 'Unknown',
        catCode: catCode,
        subCategory: getVal(row, ['subcategory', 'subcatname', 'subcategoryname']) || 'Unknown',
        subCatCode: subCatCode,
        note: getVal(row, ['note', 'description', 'remark', 'desc']) || '',
        updatedAt: new Date().toISOString(),
        updatedBy: 'import@furniture.com'
      });
      
      existingCodes.add(mastCode);
    }

    if (newItems.length > 0) {
      try {
        await addMultipleRows(newItems);
        Swal.fire({
          icon: 'success',
          title: 'Upload Summary',
          text: `Imported: ${newItems.length} records. Skipped Duplicates: ${duplicateCount}.`,
          confirmButtonText: 'Great'
        });
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: error.message || 'An error occurred during data ingestion.'
        });
      }
    } else if (duplicateCount > 0) {
      Swal.fire({
        icon: 'info',
        title: 'All Items Skipped',
        text: `All ${duplicateCount} records in the file already exist in the system.`
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No Valid Data',
        text: 'The CSV file does not contain valid category or subcategory codes.'
      });
    }

    setShowUploadModal(false);
  };

  return (
    <>
      <style>{`
        .master-custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .master-custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .master-custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .master-custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .minimal-th {
          font-size: 11px; 
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #FFFFFF; 
          padding: 16px 16px;
          font-weight: 800;
          background-color: #111f42; 
          border-bottom: 2px solid #ab8a3b;
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s;
        }
        .minimal-th:hover { background-color: #1e346b; }
        
        .minimal-td {
          padding: 8px 16px;
          vertical-align: middle;
          color: #111f42;
          font-size: 12px; 
          font-weight: 500;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }
        
        tr:hover .minimal-td {
          background-color: rgba(171, 138, 59, 0.05);
        }

        .filter-btn { 
          border-radius: 0.5rem; 
          font-size: 0.75rem; 
          font-weight: 700; 
          transition: all 0.3s; 
          white-space: nowrap; 
          border: 1px solid transparent;
        }
        .filter-btn.active { 
          background-color: #111f42; 
          color: #FFFFFF; 
          border-color: transparent;
          box-shadow: none; 
        }
        .filter-btn:not(.active) { color: #64748B; background-color: transparent; border-color: transparent; }
        .filter-btn:not(.active):hover { color: #111f42; background-color: rgba(255,255,255,0.5); }

        .filter-count {
          display: inline-flex; align-items: center; justify-content: center;
          height: 16px; min-width: 16px; padding: 0 4px;
          border-radius: 9999px; font-size: 9px; font-weight: 700;
        }
        .filter-btn.active .filter-count { background-color: rgba(255, 255, 255, 0.2); color: white; }
        .filter-btn:not(.active) .filter-count { background-color: #E2E8F0; color: #64748B; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(17, 31, 66, 0.6); backdrop-filter: blur(4px); z-index: 10001; display: flex; justify-content: center; align-items: center; opacity: 1; transition: opacity 0.3s ease; padding: 1rem; }
        .modal-box { 
          background: #F9F7F6; 
          width: 100%; max-height: 90vh; 
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
          transform: scale(1); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
          overflow: hidden; display: flex; flex-direction: column; 
        }
        
        .badge { display: inline-flex; align-items: center; padding: 0.15rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 10px; gap: 0.375rem; border: 1px solid transparent; text-transform: uppercase; }
        
        .input-primary { width: 100%; background: white; border: 1px solid #E2E8F0; border-radius: 0.5rem; padding: 8px 12px; font-size: 13px; transition: all 0.2s; color: #111f42; }
        .input-primary:focus { outline: none; border-color: #ab8a3b; box-shadow: 0 0 0 2px rgba(171, 138, 59, 0.1); }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="flex flex-col h-full pt-2 px-0 pb-10 bg-[#F9F7F6]">
        
        <PageHeader 
          title="MASTER CODE"
          subtitle="ระบบจัดการรหัสหมวดหลักและหมวดรอง"
          icon={QrCode}
          rightContent={
            <>
              <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner w-full md:w-fit flex-shrink-0 rounded-xl overflow-hidden mt-2 md:mt-0">
                <button onClick={() => setActiveTab('list')} className={`px-6 py-2 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-wide rounded-lg ${activeTab === 'list' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <List size={14} /> MASTER LIST
                </button>
                <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-wide rounded-lg ${activeTab === 'analytics' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <BarChart2 size={14} /> ANALYTICS
                </button>
              </div>
              <button onClick={() => setIsGuideOpen(true)} className="p-2 transition-all rounded-xl w-10 h-10 flex items-center justify-center bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm mt-2 md:mt-0">
                <HelpCircle size={20} />
              </button>
            </>
          }
        />

        <main className="flex-1 relative z-10 w-full px-0 mt-4">
          <div className="w-full pb-6 flex flex-col gap-4 animate-fade-in-up">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <KpiCard title="Total Items" value={(items || []).length} color="#111f42" icon={Database} subValue="All Codes" />
              <KpiCard title="Finished Goods" value={fgCount} color="#ab8a3b" icon={Package} subValue="Ready to Sell (FG)" />
              <KpiCard title="Raw Materials" value={rmCount} color="#10b981" icon={Leaf} subValue="Wood, Fabric, HW" />
              <KpiCard title="New This Month" value={newCount} color="#E3624A" icon={PlusCircle} subValue="Created Recently" />
            </div>

            <div className="bg-white rounded-none shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[600px]">
              
              {activeTab === 'list' && (
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex-1"></div>
                  <div className="flex gap-3 shrink-0 flex-nowrap items-center ml-auto">
                    <button onClick={() => setShowUploadModal(true)} className="px-5 py-2.5 rounded-xl text-[12px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-[#111f42] transition-all flex items-center gap-2 uppercase tracking-wide whitespace-nowrap">
                      <UploadCloud size={16} /> Upload
                    </button>
                    <button onClick={() => openModal()} className="px-5 py-2.5 rounded-xl text-[12px] font-bold bg-[#111f42] text-white hover:bg-[#1e346b] shadow-md transition-all flex items-center gap-2 uppercase tracking-wide whitespace-nowrap">
                      <Plus size={16} className="text-[#ab8a3b]" /> NEW CODE
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'list' && (
                <MasterList 
                  items={items || []}
                  openModal={openModal}
                  deleteItem={handleDeleteItem}
                />
              )}

              {activeTab === 'analytics' && (
                <Analytics items={items || []} activeTab={activeTab} />
              )}
            </div>
          </div>
          
          <MasterModal 
            showModal={showModal}
            closeModal={closeModal}
            form={form}
            setForm={setForm}
            groups={groups}
            openGroupManager={openGroupManager}
            toggleGroupInForm={toggleGroupInForm}
            isDuplicate={isDuplicate}
            generatedMastCode={generatedMastCode}
            saveItem={saveItem}
            isValid={isValid}
            isLoading={isLoading}
          />

          <CsvUploadModal 
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            title="Master Code Batch Upload"
            expectedHeaders={['Group', 'Category', 'CatCode', 'SubCategory', 'SubCode', 'Note']}
            onConfirm={processUploadData}
            instructions="อัปโหลด Master Code ด้วยไฟล์ .csv (คอลัมน์: Group, Category, CatCode, SubCategory, SubCode, Note)"
            isSubmitting={isLoading}
            progress={uploadProgress}
          />

          <GroupModal 
            showGroupModal={showGroupModal}
            setShowGroupModal={setShowGroupModal}
            editingGroup={editingGroup}
            editGroupText={editGroupText}
            setEditGroupText={setEditGroupText}
            saveEditGroup={saveEditGroup}
            cancelEditGroup={cancelEditGroup}
            newGroup={newGroup}
            setNewGroup={setNewGroup}
            addGroup={addGroup}
            groups={groups}
            startEditGroup={startEditGroup}
            removeGroup={removeGroup}
          />

          <GuideDrawer 
            isGuideOpen={isGuideOpen}
            setIsGuideOpen={setIsGuideOpen}
          />
        </main>
      </div>
    </>
  );
}
