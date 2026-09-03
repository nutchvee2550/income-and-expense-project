import React from 'react';

export default function Header() {
  return (
    <header 
      style={{ transform: 'translateY(16px)', marginBottom: '32px' }}
      className="w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow"
    >
      <div className="flex items-center gap-4">
        {/* โลโก้วิทยาลัย */}
        <div className="bg-white/90 p-1.5 rounded-full shadow-inner shrink-0 flex items-center justify-center">
          <img 
            src="/Logo.png" 
            alt="Logo" 
            className="h-10 sm:h-12 w-auto object-contain" 
          />
        </div>

        {/* ข้อความชื่อระบบ */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
            กระเป๋าเงินของฉัน
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-light tracking-wide">
            บันทึกรายรับ-รายจ่าย วิทยาลัยเทคโนโลยีอุดมศึกษาพณิชยการ
          </p>
        </div>
      </div>
    </header>
  );
}