import React, { useState, useEffect } from "react";

export default function DailyBudgetCard({ transactions = [] }) {
  const [dailyBudget, setDailyBudget] = useState(() => {
    const saved = localStorage.getItem("my_daily_budget");
    return saved ? parseFloat(saved) : 300;
  });

  useEffect(() => {
    localStorage.setItem("my_daily_budget", dailyBudget);
  }, [dailyBudget]);

  const formatMoney = (number) => {
    return (
      "฿" +
      number.toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const todayStr = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
  });

  const todayExpense = transactions
    .filter((t) => t.type === "expense" && t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  const remaining = dailyBudget - todayExpense;

  let theme = {
    cardBg: "bg-emerald-50/90 border-emerald-200",
    icon: "fa-circle-check text-emerald-500",
    statusText: "text-emerald-800",
    statusMessage: "🟢 วันนี้คุณยังมีเงินเหลือใช้!",
    amountText: "text-emerald-600",
  };

  if (todayExpense === dailyBudget && dailyBudget > 0) {
    theme = {
      cardBg: "bg-amber-50/90 border-amber-200",
      icon: "fa-triangle-exclamation text-amber-500",
      statusText: "text-amber-800",
      statusMessage: "🟡 วันนี้คุณใช้เงินหมดพอดี!",
      amountText: "text-amber-600",
    };
  } else if (todayExpense > dailyBudget) {
    theme = {
      cardBg: "bg-rose-50/90 border-rose-200",
      icon: "fa-circle-xmark text-rose-500",
      statusText: "text-rose-800",
      statusMessage: "🔴 เตือน! วันนี้ท่านใช้เงินเกินงบ",
      amountText: "text-rose-600",
    };
  }

  return (
    <section className={`border rounded-2xl p-4 transition-all duration-300 shadow-sm w-full h-auto min-h-fit overflow-visible ${theme.cardBg}`}>
      {/* แถวที่ 1: หัวข้อ + ช่องตั้งงบ */}
      <div className="flex flex-col xs:flex-row sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-2 border-b border-slate-200/50">
        <div className="flex items-center gap-2">
          <i className={`fa-solid ${theme.icon} text-base shrink-0`}></i>
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
            งบประมาณประจำวันนี้
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-light whitespace-nowrap">ตั้งงบ:</span>
          <input
            type="number"
            value={dailyBudget}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setDailyBudget(isNaN(val) || val < 0 ? 0 : val);
            }}
            placeholder="300"
            className="w-16 text-right font-semibold bg-transparent focus:outline-none text-slate-700"
          />
          <span className="text-slate-500 text-[11px]">บาท</span>
        </div>
      </div>

      {/* แถวที่ 2: ข้อความสถานะ + ยอดเงินคงเหลือ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div className="space-y-1">
          <p className={`text-xs font-bold ${theme.statusText}`}>
            {theme.statusMessage}
          </p>
          <p className="text-[11px] text-slate-600 leading-normal">
            ใช้ไปแล้ว <span className="font-semibold">{formatMoney(todayExpense)}</span> จากงบ {formatMoney(dailyBudget)}
          </p>
        </div>

        <div className="self-end sm:self-auto text-right border-t sm:border-t-0 border-slate-200/40 pt-1 sm:pt-0 w-full sm:w-auto">
          <p className="text-[10px] text-slate-400 font-medium">คงเหลือวันนี้</p>
          <p className={`text-base font-extrabold ${theme.amountText}`}>
            {formatMoney(Math.abs(remaining))}
          </p>
        </div>
      </div>
    </section>
  );
}