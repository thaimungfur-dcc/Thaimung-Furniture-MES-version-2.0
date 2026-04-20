import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QrCodeGeneratorProps {
  value: string;
  size?: number;
  label?: string;
  fgColor?: string;
}

export const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ 
  value, 
  size = 120, 
  label, 
  fgColor = "#111f42" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm inline-block">
      <div className="bg-white p-2 rounded-lg">
        <QRCodeSVG 
            value={value} 
            size={size} 
            fgColor={fgColor}
            level="H" 
            includeMargin={false}
        />
      </div>
      {label && (
        <span className="mt-3 text-[10px] font-black tracking-widest uppercase text-slate-500 font-mono">
          {label}
        </span>
      )}
    </div>
  );
};
