import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Paperclip, 
  X, 
  FileText, 
  Image as ImageIcon, 
  Eye, 
  Upload,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';

interface Attachment {
  id: string;
  file: File;
  previewUrl?: string;
  name: string;
  size: number;
  type: string;
}

interface FileAttachmentProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: Record<string, string[]>;
  label?: string;
}

export function FileAttachment({ 
  onFilesChange, 
  maxFiles = 5, 
  maxSizeMB = 10,
  accept = {
    'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  },
  label = "Attach Files or Images"
}: FileAttachmentProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      setError(`Some files were rejected. Max size is ${maxSizeMB}MB.`);
      return;
    }

    if (attachments.length + acceptedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    const newAttachments: Attachment[] = acceptedFiles?.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    const updated = [...attachments, ...newAttachments];
    setAttachments(updated);
    onFilesChange(updated?.map(a => a.file));
  };

  const removeAttachment = (id: string) => {
    const attachment = attachments.find(a => a.id === id);
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    
    const updated = attachments.filter(a => a.id !== id);
    setAttachments(updated);
    onFilesChange(updated?.map(a => a.file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: maxFiles > 1
  } as any);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div 
        {...getRootProps()} 
        className={`
          relative cursor-pointer border-2 border-dashed rounded-[24px] p-8 flex flex-col items-center justify-center transition-all
          ${isDragActive ? 'border-[#ab8a3b] bg-[#ab8a3b]/5 scale-[0.99] border-solid' : 'border-slate-200 bg-slate-50/50 hover:border-[#111f42]/20 hover:bg-white'}
        `}
      >
        <input {...getInputProps()} />
        <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 text-[#111f42] group-hover:scale-110 transition-transform">
          <Upload size={24} />
        </div>
        <div className="text-center">
          <p className="text-xs font-black text-[#111f42] uppercase tracking-widest">{label}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Drag & drop or Click (Max {maxSizeMB}MB)
          </p>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-rose-50 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100"
        >
          <AlertCircle size={14} />
          {error}
        </motion.div>
      )}

      {/* Preview Section */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {attachments?.map((att) => (
              <motion.div 
                key={att.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                  {att.previewUrl ? (
                    <img src={att.previewUrl} alt={att.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <FileText size={20} className="text-slate-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pr-8">
                  <p className="text-[11px] font-black text-[#111f42] truncate uppercase tracking-wider">{att.name}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{formatSize(att.size)}</p>
                </div>

                {/* Actions */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => removeAttachment(att.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100 shadow-sm bg-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
