import React, { useState, useEffect, useRef } from 'react';
import { Shield, LayoutDashboard, Users, Plus, Lock, UserCog } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { User } from './types';
import { SYSTEM_MODULES } from './constants';
import { PageHeader } from '../../components/shared/PageHeader';
import Step1Confidentiality from './components/Step1Confidentiality';
import Step2Operational from './components/Step2Operational';
import EditUserModal from './components/EditUserModal';

import { useGoogleSheets } from '../../hooks/useGoogleSheets';

export default function UserPermissions() {
  const { data: users, addRow: addUser, updateRow: updateUser, deleteRow: deleteUser, loading: usersLoading } = useGoogleSheets<User>('AppUsers');
  const { data: confData, addRow: addConf, updateRow: updateConf } = useGoogleSheets<any>('ConfidentialityMap');
  
  const [activeTab, setActiveTab] = useState<'step1' | 'step2'>('step1');
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ name: '', position: '', email: '', avatar: '' });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Removed mock data initialization as it now uses Google Sheets API

  const [confidentialityMap, setConfidentialityMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (confData && confData.length > 0) {
      const map: Record<string, boolean> = {};
      confData.forEach((item: any) => {
        map[item.moduleId] = item.isConfidential === true || item.isConfidential === 'true';
      });
      setConfidentialityMap(map);
    } else {
      const initial: Record<string, boolean> = {};
      SYSTEM_MODULES.forEach(mod => {
        initial[mod.id] = mod.isConfidential || false;
        if (mod.subItems) {
          mod.subItems.forEach(sub => {
            initial[sub.id] = sub.isConfidential || mod.isConfidential || false;
          });
        }
      });
      setConfidentialityMap(initial);
    }
  }, [confData]);

  const [matrixPermissions, setMatrixPermissions] = useState<Record<string, Record<string, number[]>>>({});

  useEffect(() => {
    if (users && users.length > 0) {
      const initial: Record<string, Record<string, number[]>> = {};
      users.forEach(user => {
        if (user.permissions) {
          try {
            initial[user.id] = typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions;
          } catch (e) {
            initial[user.id] = {};
          }
        } else {
          initial[user.id] = {};
          SYSTEM_MODULES.forEach(mod => {
            const isModConfidential = confidentialityMap[mod.id];
            const defaultLevels = user.isDev ? [1, 2, 3, 4] : (isModConfidential ? [] : [1]);
            initial[user.id][mod.id] = defaultLevels;
            if (mod.subItems) {
              mod.subItems.forEach(sub => {
                const isSubConfidential = confidentialityMap[sub.id] || isModConfidential;
                initial[user.id][sub.id] = user.isDev ? [1, 2, 3, 4] : (isSubConfidential ? [] : [1]);
              });
            }
          });
        }
      });
      setMatrixPermissions(initial);
    }
  }, [users, confidentialityMap]);

  const [currentPermissions, setCurrentPermissions] = useState<Record<string, number[]>>({});

  const toggleConfidentiality = async (id: string) => {
    const newVal = !confidentialityMap[id];
    setConfidentialityMap(prev => ({ ...prev, [id]: newVal }));
    
    // Persist to Google Sheets
    const existing = confData?.find((c: any) => c.moduleId === id);
    if (existing) {
      await updateConf(existing.id, { isConfidential: newVal });
    } else {
      await addConf({ moduleId: id, isConfidential: newVal });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditUser = (user: User) => {
    setFormData({
      name: user.name,
      position: user.position,
      email: user.email,
      avatar: user.avatar
    });
    setSelectedUserId(user.id);
    const userPerms = matrixPermissions[user.id] || {};
    setCurrentPermissions(userPerms);
    setModalStep(1);
    setIsEditModalOpen(true);
  };

  const handleNewUser = () => {
    setFormData({ name: '', position: '', email: '', avatar: '' });
    setSelectedUserId(null);
    
    const defaultPerms: Record<string, number[]> = {};
    SYSTEM_MODULES.forEach(mod => {
      const isModConfidential = confidentialityMap[mod.id];
      defaultPerms[mod.id] = isModConfidential ? [] : [1];
      if (mod.subItems) {
        mod.subItems.forEach(sub => {
          const isSubConfidential = confidentialityMap[sub.id];
          defaultPerms[sub.id] = isSubConfidential ? [] : [1];
        });
      }
    });
    
    setCurrentPermissions(defaultPerms);
    setModalStep(1);
    setIsEditModalOpen(true);
  };

  const handlePermissionChange = (menuId: string, level: number) => {
    setCurrentPermissions(prev => {
      const currentLevels = prev[menuId] || [];
      let newLevels: number[];
      if (level === 0) {
        newLevels = [];
      } else {
        if (currentLevels.includes(level)) {
          newLevels = currentLevels.filter(l => l !== level);
        } else {
          newLevels = [...currentLevels, level].filter(l => l !== 0);
        }
      }
      return { ...prev, [menuId]: newLevels };
    });
  };

  const toggleExpand = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in Name and Email');
      return;
    }
    const userId = selectedUserId || Date.now().toString();
    const userData = {
      ...formData,
      id: userId,
      permissions: JSON.stringify(currentPermissions)
    };

    try {
      if (!selectedUserId) {
        await addUser(userData);
      } else {
        await updateUser(selectedUserId, userData);
      }
      setIsEditModalOpen(false);
    } catch (error) {
      alert('Failed to save');
    }
  };

  const nodeRef = useRef(null);

  return (
    <div className="relative font-sans w-full flex flex-col pb-6">
      <div className="relative z-10 w-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <PageHeader
          title="USER PERMISSIONS"
          subtitle="Access Control & Authorization"
          icon={Shield}
          iconColor="text-[#E3624A]"
          rightContent={
            <div className="flex flex-col items-end gap-3">
              <div className="bg-[#e2e8f0] p-1 rounded-xl shadow-inner flex gap-1">
                <button 
                  onClick={() => setActiveTab('step1')}
                  className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 tracking-wide ${activeTab === 'step1' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <Lock size={14} /> Step 1: Confidentiality
                </button>
                <button 
                  onClick={() => setActiveTab('step2')}
                  className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 tracking-wide ${activeTab === 'step2' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <UserCog size={14} /> Step 2: Operational Rights
                </button>
              </div>

              {activeTab === 'step2' && (
                <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex gap-1">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 tracking-widest ${viewMode === 'list' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Users size={14} /> User List
                  </button>
                  <button 
                    onClick={() => setViewMode('matrix')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 tracking-widest ${viewMode === 'matrix' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <LayoutDashboard size={14} /> Summary Matrix
                  </button>
                  <button 
                    onClick={handleNewUser}
                    className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 bg-[#111f42] text-white shadow-md hover:bg-[#1e346b] ml-2 tracking-widest"
                  >
                    <Plus size={14} className="text-[#ab8a3b]" /> Add User
                  </button>
                </div>
              )}
            </div>
          }
        />

        {activeTab === 'step1' && (
          <Step1Confidentiality 
            confidentialityMap={confidentialityMap}
            toggleConfidentiality={toggleConfidentiality}
            expandedModules={expandedModules}
            toggleExpand={toggleExpand}
          />
        )}

        {activeTab === 'step2' && (
          <Step2Operational 
            viewMode={viewMode}
            users={users}
            handleEditUser={handleEditUser}
            expandedModules={expandedModules}
            toggleExpand={toggleExpand}
            confidentialityMap={confidentialityMap}
            matrixPermissions={matrixPermissions}
          />
        )}

        <AnimatePresence>
          {isEditModalOpen && (
            <EditUserModal 
              nodeRef={nodeRef}
              setIsEditModalOpen={setIsEditModalOpen}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSave={handleSave}
              modalStep={modalStep}
              expandedModules={expandedModules}
              toggleExpand={toggleExpand}
              currentPermissions={currentPermissions}
              handlePermissionChange={handlePermissionChange}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
