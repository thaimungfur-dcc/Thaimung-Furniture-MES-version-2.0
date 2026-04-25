import React from 'react';
import { X, CheckCircle, Package, ImagePlus, Save, Trash2 } from 'lucide-react';
import { ModalMode, Category, Product, InspectionStandard } from '../types';
import { ITEM_MASTER_DB } from '../constants';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface ActionModalProps {
    showModal: boolean;
    modalMode: ModalMode;
    isEditing: boolean;
    selectedCategory: Category | null;
    activeDetailTab: string;
    productForm: any;
    standardForm: any;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onClose: () => void;
    onSave: () => void;
    onDeleteProduct: (id: number) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onProductFormChange: (field: string, value: any) => void;
    onStandardFormChange: (field: string, value: any) => void;
    onItemMasterSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function ActionModal({
    showModal,
    modalMode,
    isEditing,
    selectedCategory,
    activeDetailTab,
    productForm,
    standardForm,
    fileInputRef,
    onClose,
    onSave,
    onDeleteProduct,
    onImageUpload,
    onProductFormChange,
    onStandardFormChange,
    onItemMasterSelect
}: ActionModalProps) {
    if (!showModal) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            
            <DraggableWrapper>
                  <div 
                            className="modal-box w-full max-w-2xl border-t-[6px] border-[#ab8a3b] rounded-2xl animate-fade-in-up flex flex-col max-h-[90vh]" 
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-5 bg-[#111f42] flex justify-between items-center text-white shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-xl shadow-inner text-[#ab8a3b]">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-tight">
                                            {isEditing ? 'Edit' : 'Add New'} {modalMode === 'product' ? 'Product' : 'Standard'}
                                        </h3>
                                        <p className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-widest mt-0.5">
                                            {modalMode === 'product' ? `CAT: ${selectedCategory?.name || 'Manual'}` : `STEP: ${activeDetailTab}`}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="p-4 sm:p-5 bg-[#F9F7F6] overflow-y-auto master-custom-scrollbar space-y-5 flex-1">
                                {modalMode === 'product' ? (
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                                        {!isEditing ? (
                                            <div>
                                                <label className="block text-[10px] font-black text-[#111f42] uppercase mb-1.5 tracking-widest font-mono flex items-center gap-2">
                                                    <Package size={12} className="text-[#ab8a3b]"/> Select from Item Master *
                                                </label>
                                                <select 
                                                    value={productForm.code} 
                                                    onChange={onItemMasterSelect} 
                                                    className="input-primary font-bold text-[13px] bg-white cursor-pointer py-2"
                                                >
                                                    <option value="">-- Choose Item from Master List --</option>
                                                    {ITEM_MASTER_DB?.map(i => <option key={i.itemCode} value={i.itemCode}>{i.itemCode} : {i.itemName}</option>)}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Editing Code:</span>
                                                <span className="text-[14px] font-black text-[#111f42] font-mono tracking-tight">{productForm.code}</span>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 font-mono">Product Name *</label>
                                                <input 
                                                    value={productForm.name} 
                                                    onChange={e => onProductFormChange('name', e.target.value)} 
                                                    className="input-primary font-bold" 
                                                    placeholder="Product name" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 font-mono">Status</label>
                                                <select 
                                                    value={productForm.status} 
                                                    onChange={e => onProductFormChange('status', e.target.value)} 
                                                    className="input-primary font-bold bg-white cursor-pointer h-10"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="In Development">In Development</option>
                                                    <option value="Archived">Archived</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-black text-[#111f42] uppercase mb-1 font-mono">Point (จุดตรวจสอบ) *</label>
                                            <input 
                                                value={standardForm.point} 
                                                onChange={e => onStandardFormChange('point', e.target.value)} 
                                                className="input-primary font-bold" 
                                                placeholder="e.g. รอยเชื่อมพอก" 
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-black text-[#111f42] uppercase mb-1 font-mono">Criteria (เกณฑ์ยอมรับ) *</label>
                                            <textarea 
                                                value={standardForm.criteria} 
                                                onChange={e => onStandardFormChange('criteria', e.target.value)} 
                                                className="input-primary h-20 resize-none leading-normal text-[12px]" 
                                                placeholder="ระบุรายละเอียด..."
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-[#111f42] uppercase mb-1 font-mono">Tolerance</label>
                                            <input 
                                                value={standardForm.tolerance} 
                                                onChange={e => onStandardFormChange('tolerance', e.target.value)} 
                                                className="input-primary font-mono font-bold" 
                                                placeholder="+/- 1mm" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-[#111f42] uppercase mb-1 font-mono">Tool</label>
                                            <input 
                                                value={standardForm.tool} 
                                                onChange={e => onStandardFormChange('tool', e.target.value)} 
                                                className="input-primary" 
                                                placeholder="e.g. Caliper" 
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mt-2">
                                    <label className="block text-[10px] font-black text-[#111f42] uppercase mb-2 font-mono tracking-widest">Reference Image</label>
                                    <div 
                                        className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center cursor-pointer hover:border-[#ab8a3b] transition bg-white" 
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {(modalMode === 'product' ? productForm.image : standardForm.image) ? (
                                            <img 
                                                src={modalMode === 'product' ? productForm.image : standardForm.image} 
                                                className="h-32 mx-auto object-contain rounded-xl shadow-sm" 
                                                alt="Preview" 
                                            />
                                        ) : (
                                            <div className="text-slate-300 py-2.5 flex flex-col items-center gap-1">
                                                <ImagePlus size={36} strokeWidth={1} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Upload Photo</span>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onImageUpload} />
                                </div>
                            </div>
                            
                            <div className="p-5 border-t border-slate-200 bg-white flex justify-between items-center rounded-b-2xl shrink-0">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={onClose} 
                                        className="px-5 py-2 text-slate-400 font-black text-[10px] hover:text-[#111f42] uppercase tracking-widest font-mono"
                                    >
                                        Cancel
                                    </button>
                                    {isEditing && modalMode === 'product' && (
                                        <button 
                                            onClick={() => onDeleteProduct(productForm.id)} 
                                            className="px-5 py-2 text-rose-400 font-black text-[10px] hover:text-rose-600 uppercase tracking-widest font-mono flex items-center gap-1.5"
                                        >
                                            <Trash2 size={14}/> Delete
                                        </button>
                                    )}
                                </div>
                                <button 
                                    onClick={onSave} 
                                    className="bg-[#111f42] text-[#ab8a3b] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md hover:brightness-110 flex items-center gap-2 transition font-mono"
                                >
                                    <Save size={14} /> {isEditing ? 'Update' : 'Save'} {modalMode === 'product' ? 'Product' : 'Spec'}
                                </button>
                            </div>
                        </div>
                </DraggableWrapper>

        </div>
    );
}
