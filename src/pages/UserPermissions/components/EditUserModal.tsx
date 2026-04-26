import React from 'react';
import { motion } from 'motion/react';
import Draggable from 'react-draggable';
import { UserCog, Image as ImageIcon, Save, Lock, ChevronDown } from 'lucide-react';
import { SYSTEM_MODULES, PERMISSION_LEVELS } from '../constants';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface EditUserModalProps {
  nodeRef: React.RefObject<HTMLDivElement>;
  setIsEditModalOpen: (open: boolean) => void;
  formData: { name: string; position: string; email: string; avatar: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  modalStep: 1 | 2;
  expandedModules: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  currentPermissions: Record<string, number[]>;
  handlePermissionChange: (menuId: string, level: number) => void;
}

export default function EditUserModal({
  nodeRef,
  setIsEditModalOpen,
  formData,
  handleInputChange,
  handleSave,
  modalStep,
  expandedModules,
  toggleExpand,
  currentPermissions,
  handlePermissionChange
}: EditUserModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      
          <DraggableWrapper>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsEditModalOpen(false)}
                  className="absolute inset-0 bg-[#111f42]/60 backdrop-blur-sm pointer-events-auto"
                />
              </DraggableWrapper>

      <Draggable nodeRef={nodeRef} handle=".modal-drag-handle" cancel="button, input, select, textarea">
        <div ref={nodeRef} className="relative w-full max-w-[1200px] h-[90vh] pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full h-full bg-[#F9F8F4] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
          >
            <div className="flex h-full">
              {/* Left: User Form */}
              <div className="w-1/3 bg-white border-r border-gray-200 p-4 flex flex-col overflow-y-auto custom-scrollbar">
                <h3 className="text-xs font-bold text-[#0F172A] uppercase mb-4 flex items-center gap-2 border-b border-gray-200 pb-2 modal-drag-handle cursor-move select-none">
                  <UserCog size={14} /> User Details
                </h3>
                
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                    {formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" /> : <ImageIcon size={28} className="text-gray-300" />}
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <label className="text-[9px] font-bold text-[#64748B] uppercase block mb-1">Image URL</label>
                    <input type="text" name="avatar" value={formData.avatar} onChange={handleInputChange} className="w-full bg-[#F9F8F4] rounded-lg px-3 py-1.5 text-xs border border-transparent focus:border-[#ab8a3b] outline-none transition-all"/>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-[#64748B] uppercase block mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#F9F8F4] rounded-lg px-3 py-1.5 text-xs border border-transparent focus:border-[#ab8a3b] outline-none transition-all"/>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-[#64748B] uppercase block mb-1">Position</label>
                    <input type="text" name="position" value={formData.position} onChange={handleInputChange} className="w-full bg-[#F9F8F4] rounded-lg px-3 py-1.5 text-xs border border-transparent focus:border-[#ab8a3b] outline-none transition-all"/>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-[#64748B] uppercase block mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#F9F8F4] rounded-lg px-3 py-1.5 text-xs border border-transparent focus:border-[#ab8a3b] outline-none transition-all"/>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200 mt-3">
                  <button onClick={handleSave} className="w-full bg-[#111f42] text-white py-2.5 rounded-xl text-xs font-bold uppercase hover:bg-[#ab8a3b] transition-all flex items-center justify-center gap-2 shadow-lg">
                    <Save size={14} /> Save Changes
                  </button>
                  <button onClick={() => setIsEditModalOpen(false)} className="w-full mt-2 text-gray-400 text-[10px] font-bold uppercase hover:text-red-500 transition-colors">Cancel</button>
                </div>
              </div>

              {/* Right: Permission Tree */}
              <div className="w-2/3 p-4 flex flex-col overflow-hidden">
                {/* Stepper Header */}
                <div className="flex items-center gap-3 mb-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm modal-drag-handle cursor-move select-none">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${modalStep === 1 ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-gray-400'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${modalStep === 1 ? 'bg-[#ab8a3b] text-[#111f42]' : 'bg-gray-100 text-gray-400'}`}>1</div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Confidentiality</span>
                  </div>
                  <div className="h-px w-6 bg-gray-200"></div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${modalStep === 2 ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-gray-400'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${modalStep === 2 ? 'bg-[#ab8a3b] text-[#111f42]' : 'bg-gray-100 text-gray-400'}`}>2</div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Operational Rights</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3 shrink-0">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      {modalStep === 1 ? 'Step 1: Visibility & Confidentiality' : 'Step 2: Operational Permissions'}
                    </h3>
                    <p className="text-[10px] text-[#64748B]">
                      {modalStep === 1 
                        ? 'Define which modules this user can see. Confidential modules are restricted by default.' 
                        : 'Define what actions this user can perform (Edit, Verify, Approve).'}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {PERMISSION_LEVELS?.filter(p => {
                      if (modalStep === 1) return p.level <= 1;
                      return p.level === 0 || p.level >= 2;
                    })?.map(p => (
                      <div key={p.level} className="flex items-center gap-1 bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[9px] text-gray-500">
                        <p.icon size={8} style={{color: p.color}} /> {p.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-y-auto pr-1 space-y-2 custom-scrollbar flex-1">
                  {SYSTEM_MODULES?.map((module) => {
                    const isExpanded = expandedModules[module.id];
                    const hasSub = module.subItems && module.subItems.length > 0;
                    const currentLevels = currentPermissions[module.id] || [];

                    return (
                      <div key={module.id} className={`bg-white rounded-xl border p-2 hover:shadow-sm transition-shadow ${module.isConfidential ? 'border-red-100' : 'border-white'}`}>
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-2 ${hasSub ? 'cursor-pointer select-none' : ''}`} onClick={() => hasSub && toggleExpand(module.id)}>
                            <div className={`p-1.5 rounded-lg ${module.isConfidential ? 'bg-red-50 text-red-500' : 'bg-[#111f42]/5 text-[#111f42]'}`}>
                              <module.icon size={16} />
                            </div>
                            <span className="font-bold text-[#0F172A] text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                              {module.label} 
                              {module.isConfidential && <Lock size={10} className="text-red-500" />}
                              {hasSub && <ChevronDown size={10} className={`text-[#64748B] transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>}
                            </span>
                          </div>
                          <div className="flex bg-white rounded-lg p-0.5 border border-gray-200 shadow-sm gap-0.5">
                            {PERMISSION_LEVELS?.filter(p => {
                              if (modalStep === 1) return p.level <= 1;
                              return p.level === 0 || p.level >= 2;
                            })?.map((p) => {
                              const isActive = p.level === 0 
                                ? currentLevels.length === 0 || (modalStep === 2 && !currentLevels?.some(l => l >= 2))
                                : currentLevels.includes(p.level);

                              return (
                                <button
                                  key={p.level}
                                  onClick={() => handlePermissionChange(module.id, p.level)}
                                  className={`flex items-center justify-center w-6 h-6 rounded transition-all duration-200 relative group cursor-pointer
                                    ${isActive ? 'shadow-sm scale-105 z-10 ring-1 ring-black/5' : 'hover:bg-gray-50 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'}
                                  `}
                                  style={{ backgroundColor: isActive ? p.bg : 'transparent' }}
                                  title={p.label}
                                >
                                  <p.icon size={12} style={{color: isActive ? p.color : '#64748B'}} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        {hasSub && (
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-8 space-y-0.5 border-l border-gray-200 ml-3 py-0.5">
                              {module.subItems?.map(sub => {
                                const subLevels = currentPermissions[sub.id] || [];
                                return (
                                  <div key={sub.id} className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                                    <span className="text-[10px] font-bold text-[#64748B] flex items-center gap-1.5">
                                      {sub.label}
                                      {sub.isConfidential && <Lock size={8} className="text-red-500" />}
                                    </span>
                                    <div className="flex gap-0.5">
                                      {PERMISSION_LEVELS?.filter(p => {
                                        if (modalStep === 1) return p.level <= 1;
                                        return p.level === 0 || p.level >= 2;
                                      })?.map((p) => {
                                        const isActive = p.level === 0 
                                          ? subLevels.length === 0 || (modalStep === 2 && !subLevels?.some(l => l >= 2))
                                          : subLevels.includes(p.level);

                                        return (
                                          <button
                                            key={p.level}
                                            onClick={() => handlePermissionChange(sub.id, p.level)}
                                            className={`flex items-center justify-center w-5 h-5 rounded transition-all duration-200 relative group cursor-pointer
                                              ${isActive ? 'shadow-sm scale-105 z-10 ring-1 ring-black/5' : 'hover:bg-gray-100 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'}
                                            `}
                                            style={{ backgroundColor: isActive ? p.bg : 'transparent' }}
                                            title={p.label}
                                          >
                                            <p.icon size={10} style={{color: isActive ? p.color : '#64748B'}} />
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Draggable>
    </div>
  );
}
