import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Info,
  ChevronRight,
  Database,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any[]) => void;
  title: string;
  expectedHeaders: string[];
  instructions?: string;
  isSubmitting?: boolean;
  progress?: number;
}

export function CsvUploadModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  expectedHeaders,
  instructions,
  isSubmitting = false,
  progress = 0
}: CsvUploadModalProps) {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview'>('upload');

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          processData(results.data, results.meta.fields || []);
        },
        error: (err: any) => {
          handleError(err.message);
        }
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            const fileHeaders = jsonRows.length > 0 ? Object.keys(jsonRows[0] as any) : [];
            processData(jsonRows, fileHeaders);
        } catch (err) {
            handleError("Failed to parse Excel file. Ensure it is not corrupted.");
        }
      };
      reader.onerror = (err) => handleError(err.toString());
      reader.readAsBinaryString(file);
    } else {
      handleError("Unsupported file format. Please upload .csv or .xlsx");
    }
  };

  const processData = (parsedData: any[], fileHeaders: string[]) => {
    // Basic check: all expected headers should be present
    const missingHeaders = expectedHeaders?.filter(h => !fileHeaders.includes(h));
    
    if (missingHeaders.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Structure',
        text: `Missing columns: ${missingHeaders.join(', ')}`,
        confirmButtonColor: '#111f42'
      });
      setIsLoading(false);
      return;
    }

    setHeaders(fileHeaders);
    setData(parsedData);
    setStep('preview');
    setIsLoading(false);
  };

  const handleError = (msg: string) => {
    Swal.fire({
      icon: 'error',
      title: 'Upload Error',
      text: msg,
      confirmButtonColor: '#111f42'
    });
    setIsLoading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  } as any);

  const reset = () => {
    setData([]);
    setHeaders([]);
    setStep('upload');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#111f42]/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[40px] shadow-2xl border border-white/20 w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#111f42] text-white rounded-[20px] shadow-xl shadow-blue-900/10">
                  <Database size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#111f42] uppercase tracking-[0.15em]">{title}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Bulk Integration Protocol / Step {step === 'upload' ? '1: Validation' : '2: Data Review'}</p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-3 bg-white text-slate-400 hover:text-[#E3624A] hover:bg-red-50 rounded-2xl transition-all border border-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 master-custom-scrollbar bg-[#F9F7F6]">
              {step === 'upload' ? (
                <div className="space-y-5">
                  {/* Instructions */}
                  <div className="bg-white rounded-3xl p-5 border border-blue-100 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50/30 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="flex items-start gap-5 relative z-10">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <Info size={24} />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-[#111f42] uppercase tracking-widest">CSV Data Preparation Guidelines</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-2xl">
                          Ensure your spreadsheet matches the requirements below to prevent ingestion failure. All column headers must match exactly (case-sensitive).
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {expectedHeaders?.map(h => (
                            <span key={h} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-wider">
                              <FileText size={10} /> {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dropzone */}
                  <div 
                    {...getRootProps()} 
                    className={`
                      relative group cursor-pointer border-4 border-dashed rounded-[40px] p-20 flex flex-col items-center justify-center transition-all duration-300 min-h-[350px]
                      ${isDragActive ? 'border-primary bg-primary/5 scale-[0.99] border-solid' : 'border-slate-200 bg-white hover:border-[#111f42]/20'}
                    `}
                  >
                    <input {...getInputProps()} />
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-[#111f42] rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                      <div className={`p-5 rounded-full border-4 border-white shadow-2xl transition-all duration-500 ${isDragActive ? 'bg-[#111f42] text-white rotate-12' : 'bg-[#111f42] text-white group-hover:scale-110'}`}>
                        <UploadCloud size={48} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <h4 className="text-lg font-black text-[#111f42] uppercase tracking-widest">
                        {isDragActive ? 'Release to Ingest' : 'Deploy CSV Data File'}
                      </h4>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Drag and drop your file here or click to browse</p>
                    </div>
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[40px] flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#111f42] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-[#111f42] uppercase tracking-[0.3em]">Parsing Matrix...</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-a">
                  {/* Preview Stats */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</span>
                        <div className="flex items-center gap-2 text-emerald-500 font-black text-xs mt-1">
                          <CheckCircle2 size={16} /> VALIDATED READY
                        </div>
                      </div>
                      <div className="w-px h-10 bg-slate-200"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RECORD COUNT</span>
                        <div className="text-[#111f42] font-black text-xl font-mono mt-0.5">{data.length?.toLocaleString()} <span className="text-[10px] uppercase font-sans text-slate-400 tracking-widest">ROWS</span></div>
                      </div>
                    </div>
                    <button 
                      onClick={reset}
                      className="px-6 py-2.5 text-[10px] font-black text-slate-500 hover:text-[#E3624A] uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                      <X size={14} /> Reset and Upload Again
                    </button>
                  </div>

                  {/* Preview Table */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="max-h-[400px] overflow-auto master-custom-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10 bg-[#111f42]">
                          <tr>
                            {headers?.map(h => (
                              <th key={h} className="px-6 py-3.5 text-[10px] font-black text-white uppercase tracking-widest border-b border-blue-900/50">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.slice(0, 5)?.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              {headers?.map(h => (
                                <td key={`${i}-${h}`} className="px-6 py-2.5 text-[11px] font-bold text-[#111f42] whitespace-nowrap">
                                  {row[h]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-6 py-2.5 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest text-center border-t border-amber-100 flex items-center justify-center gap-2">
                      <AlertCircle size={14} /> Showing 5 rows preview. Integration summary: {data.length} total records found in matrix.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-100 flex items-center justify-end bg-slate-50/50 gap-4">
              <button 
                onClick={handleClose}
                className="px-5 py-3 text-[11px] font-black text-slate-500 hover:text-[#111f42] uppercase tracking-[0.2em] transition-all"
              >
                Cancel Process
              </button>
              {step === 'preview' && (
                <div className="flex flex-col items-end gap-2">
                  {isSubmitting && (
                    <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  )}
                  <button 
                    onClick={() => onConfirm(data)}
                    disabled={isSubmitting}
                    className={`px-6 py-2.5 bg-[#111f42] text-white rounded-[20px] shadow-xl shadow-blue-900/20 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Ingesting ({progress}%)
                      </>
                    ) : (
                      <>
                        Confirm Ingestion
                        <ChevronRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
