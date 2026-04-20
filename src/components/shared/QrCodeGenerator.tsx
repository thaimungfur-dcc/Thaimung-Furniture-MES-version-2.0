import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Target } from 'lucide-react';

interface QrCodeGeneratorProps {
  value: string;
  size?: number;
  title?: string;
  subtitle?: string;
}

export function QrCodeGenerator({ 
  value, 
  size = 180, 
  title, 
  subtitle 
}: QrCodeGeneratorProps) {
  
  const downloadQR = () => {
    const svg = document.getElementById('shared-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size + 40;
      canvas.height = size + 40;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
      }
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR_${value}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm transition-all group hover:shadow-md">
      {title && (
        <div className="text-center mb-6">
          <h4 className="text-sm font-black text-[#111f42] uppercase tracking-widest">{title}</h4>
          {subtitle && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{subtitle}</p>}
        </div>
      )}
      
      <div className="relative p-6 bg-slate-50/50 rounded-[40px] border border-slate-100 mb-8 transition-transform group-hover:scale-105 duration-500">
        <div className="absolute inset-0 bg-[#ab8a3b]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative bg-white p-4 rounded-[28px] shadow-2xl border border-white">
          <QRCodeSVG
            id="shared-qr-code"
            value={value}
            size={size}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: "https://ais-dev-jmai4qzmteeyuxn3ldcyxo-553047369552.asia-southeast1.run.app/favicon.ico",
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            navigator.clipboard.writeText(value);
            // Optionally add a toast here
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#111f42] hover:text-white transition-all border border-slate-100"
        >
          <Target size={14} /> Copy Value
        </button>
        <button
          onClick={downloadQR}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#111f42] text-[#ab8a3b] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-blue-900/10 transition-all"
        >
          <Download size={14} /> Download PNG
        </button>
      </div>
    </div>
  );
}
