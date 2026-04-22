import React, { useState } from 'react';
import { Settings, Plus, Edit2, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useMasterData, ConfigSetting } from '../../context/MasterDataContext';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import { DraggableModal } from '../../components/shared/DraggableModal';

const categories = [
    { id: 'departments', label: 'Departments', icon: '🏢' },
    { id: 'units', label: 'Units of Measure', icon: '⚖️' },
    { id: 'locations', label: 'Warehouse Locations', icon: '📍' },
    { id: 'itemCategories', label: 'Item Categories', icon: '📦' },
    { id: 'paymentTerms', label: 'Payment Terms', icon: '💳' },
    { id: 'taxRates', label: 'Tax Rates', icon: '📊' },
];

export default function SystemConfig() {
    const { settings, addSetting, updateSetting, deleteSetting } = useMasterData();
    const [activeCategory, setActiveCategory] = useState('departments');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', code: '' });

    const currentSettings = settings.filter(s => s.category === activeCategory);
    const categoryInfo = categories.find(c => c.id === activeCategory);

    const handleAdd = () => {
        setEditingId(null);
        setFormData({ name: '', code: '' });
        setShowModal(true);
    };

    const handleEdit = (setting: ConfigSetting) => {
        setEditingId(setting.id);
        setFormData({ name: setting.name, code: setting.code });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this setting?')) {
            await deleteSetting(id);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await updateSetting(editingId, { ...formData });
        } else {
            await addSetting({ id: Date.now().toString(), category: activeCategory, ...formData });
        }
        setShowModal(false);
    };

    const columns: ColumnDef<ConfigSetting>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: info => <span className="font-medium text-slate-800">{info.getValue() as string}</span>
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: info => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    {info.getValue() as string}
                </span>
            )
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex justify-end items-center gap-3">
                    <button 
                        onClick={() => handleEdit(row.original)}
                        className="text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 p-1.5 rounded-md"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button 
                        onClick={() => handleDelete(row.original.id)}
                        className="text-rose-600 hover:text-rose-800 transition-colors bg-rose-50 p-1.5 rounded-md"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="pt-8 pb-10 flex flex-col">
            <style>{`
                * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
            `}</style>
            
            <div className="mb-6">
                <PageHeader 
                    title="SETTING CONFIG" 
                    subtitle="SYSTEM CONFIGURATION & MASTER DATA"
                    icon={Settings}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                activeCategory === category.id
                                    ? 'bg-slate-800 text-white font-medium shadow-md'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                        >
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-6 border border-slate-200 flex justify-between items-center bg-white rounded-t-xl shadow-sm">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{categoryInfo?.label}</h2>
                            <p className="text-sm text-slate-500 mt-1">Manage {categoryInfo?.label.toLowerCase()} list and codes used across the system.</p>
                        </div>
                        <button 
                            onClick={handleAdd}
                            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-md hover:-translate-y-0.5 duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add New</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto mt-4">
                        <DataTable 
                           data={currentSettings} 
                           columns={columns} 
                           fileName={`Config_${categoryInfo?.label}`} 
                           searchPlaceholder={`Search ${categoryInfo?.label}...`}
                           itemsPerPage={15}
                        />
                    </div>
                </div>
            </div>

            {/* Modal using Shared Component */}
            <DraggableModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)}
                title={`${editingId ? 'Edit' : 'Add New'} ${categoryInfo?.label}`}
                width="max-w-md"
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                        <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111f42] transition-shadow"
                            placeholder="e.g. Finance"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                        <input 
                            type="text" 
                            required
                            value={formData.code}
                            onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111f42] transition-shadow uppercase"
                            placeholder="e.g. FIN-01"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-6 mt-4 border-t border-slate-200">
                        <button 
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors border border-transparent"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2 text-sm font-bold bg-[#111f42] text-white hover:bg-[#111f42]/90 rounded-lg transition-transform shadow-md hover:scale-105"
                        >
                            Save Setting
                        </button>
                    </div>
                </form>
            </DraggableModal>
        </div>
    );
}
