import React from 'react';
import DraggableModal from './DraggableModal';

interface AspectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AspectModal({ isOpen, onClose }: AspectModalProps) {
  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} title="Environmental Aspect Details">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Aspect Name</label>
          <p className="text-sm text-gray-900 font-medium">Energy Consumption</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Impact</label>
          <p className="text-sm text-gray-900">Depletion of natural resources and greenhouse gas emissions.</p>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </DraggableModal>
  );
}
