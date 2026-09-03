import React, { useState, useEffect } from "react";
import Header from "./Header";
import ExpenseTracker from "./ExpenseTracker";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";

const COLORS = [
  "bg-amber-500",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-purple-500",
];

// 📰 ข้อมูลข่าวสารครบ 5 ข้อ
const NEWS_DATA = [
  {
    id: 1,
    title: "💡 5 เทคนิคการออมเงินฉบับนักเรียน/นักศึกษา",
    date: "2 ก.ย. 2026",
    tag: "วางแผนการเงิน",
    summary: "วิธีบริหารเงินค่าขนมให้มีเงินเก็บฉบับทำได้จริง ไม่กระทบการเรียน...",
    url: "https://www.sanook.com/money/",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    id: 2,
    title: "📈 อัปเดตอัตราดอกเบี้ยเงินฝากดิจิทัลล่าสุด",
    date: "1 ก.ย. 2026",
    tag: "การลงทุน",
    summary: "เปรียบเทียบดอกเบี้ยบัญชีออมทรัพย์ดิจิทัล ดอกเบี้ยสูง...",
    url: "https://www.thairath.co.th/money",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 3,
    title: "🛑 4 กับดักทางการเงินที่วัยรุ่นมักพลาด",
    date: "28 ส.ค. 2026",
    tag: "ข้อควรระวัง",
    summary: "เตือนภัยพฤติกรรมการใช้เงินแบบ 'ของมันต้องมี'...",
    url: "https://money.kapook.com/",
    badgeColor: "bg-rose-100 text-rose-700",
  },
  {
    id: 4,
    title: "💳 บัตรเครดิต vs บัตรเดบิต ต่างกันอย่างไร?",
    date: "25 ส.ค. 2026",
    tag: "ความรู้พื้นฐาน",
    summary: "เลือกใช้บัตรให้เหมาะกับไลฟ์สไตล์ ได้สิทธิประโยชน์สูงสุด...",
    url: "https://www.bot.or.th/",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 5,
    title: "🚀 เริ่มต้นลงทุนฉบับมือใหม่ด้วยงบ 100 บาท",
    date: "20 ส.ค. 2026",
    tag: "กองทุนรวม",
    summary: "ต่อยอดเงินออมผ่านกองทุนรวมดัชนี ลงทุนง่ายผ่านแอป...",
    url: "https://www.setinvestnow.com/",
    badgeColor: "bg-purple-100 text-purple-700",
  },
];

// 📅 บิลประจำเดือนที่ต้องชำระ
const UPCOMING_BILLS = [
  { id: 1, name: "ค่าอินเทอร์เน็ตบ้าน", amount: 599, dueDate: "10 ก.ย.", icon: "🌐", status: "pending" },
  { id: 2, name: "สมัครบริการ Streaming", amount: 299, dueDate: "15 ก.ย.", icon: "🎬", status: "pending" },
  { id: 3, name: "ค่าโทรศัพท์มือถือ", amount: 499, dueDate: "25 ก.ย.", icon: "📱", status: "paid" },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [calcSavings, setCalcSavings] = useState(1000);
  const [calcMonths, setCalcMonths] = useState(12);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "expense",
      category: "🎬 ความบันเทิง / เกม",
      amount: 2000,
      note: "เติมเกม",
      date: "22 ส.ค. 2569",
    },
    {
      id: 2,
      type: "expense",
      category: "🛍️ ช้อปปิ้ง / ของใช้",
      amount: 500,
      note: "ค่ากิน",
      date: "22 ส.ค. 2569",
    },
    {
      id: 3,
      type: "expense",
      category: "🍔 อาหาร & เครื่องดื่ม",
      amount: 5000,
      note: "ค่าอาหารแมว",
      date: "22 ส.ค. 2569",
    },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <Login onLoginSuccess={setUser} />;
  if (user.role === "admin")
    return <AdminDashboard user={user} onLogout={handleLogout} />;

  const expenses = transactions.filter((t) => t.type === "expense");
  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  const categorySummary = Object.values(
    expenses.reduce((acc, { category, amount }) => {
      acc[category] = acc[category] || { name: category, amount: 0 };
      acc[category].amount += Number(amount);
      return acc;
    }, {}),
  ).map((cat) => ({
    ...cat,
    percentage: totalExpense
      ? Math.round((cat.amount / totalExpense) * 100)
      : 0,
  }));

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-12 antialiased overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <Header />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* คอลัมน์ซ้าย (Tracker) */}
          <div className="lg:col-span-7 space-y-6">
            <ExpenseTracker
              transactions={transactions}
              onAddTransaction={(tx) =>
                setTransactions((prev) => [tx, ...prev])
              }
              onDeleteTransaction={(id) =>
                setTransactions((prev) => prev.filter((t) => t.id !== id))
              }
              onClearAll={() => setTransactions([])}
            />
          </div>

          {/* คอลัมน์ขวา (Widgets) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Widget 1: สรุปตามหมวดหมู่ */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <i className="fa-solid fa-chart-pie text-indigo-500 text-sm" />
                สรุปตามหมวดหมู่ (เดือนนี้)
              </h3>

              <div className="space-y-4">
                {!categorySummary.length ? (
                  <p className="text-sm text-slate-400 text-center py-4">
                    ยังไม่มีรายการรายจ่าย
                  </p>
                ) : (
                  categorySummary.map((cat, i) => (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm font-medium mb-1.5">
                        <span className="text-slate-700 truncate max-w-[180px]">
                          {cat.name}
                        </span>
                        <span className="text-slate-600 font-semibold">
                          ฿{cat.amount.toLocaleString()} ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`${COLORS[i % COLORS.length]} h-full rounded-full transition-all duration-300`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Widget 2: รายการบิลที่ต้องชำระ */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-calendar-check text-rose-500" /> บิลที่ต้องจ่ายเร็วๆ นี้
                </h3>
                <span className="text-xs font-bold text-slate-400">3 รายการ</span>
              </div>
              <div className="space-y-2.5">
                {UPCOMING_BILLS.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{bill.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{bill.name}</p>
                        <p className="text-[10px] text-slate-400">กำหนดชำระ: {bill.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800">฿{bill.amount}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        bill.status === "paid" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                      }`}>
                        {bill.status === "paid" ? "จ่ายแล้ว" : "รอดำเนินการ"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

         {/* Widget 3: เครื่องคำนวณเงินออม (มีช่องพิมพ์ตัวเลข + สไลเดอร์ + ปุ่มลัด) */}
<div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 relative overflow-hidden">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
        <i className="fa-solid fa-calculator text-[10px]" />
      </div>
      วางแผนและจำลองเงินออม
    </h3>
    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
      ดอกเบี้ย ~3%/ปี
    </span>
  </div>

  <div className="space-y-3">
    {/* Input 1: เงินออมต่อเดือน (ช่องพิมพ์ + Slider) */}
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label htmlFor="savings-input" className="text-xs font-bold text-slate-700">
          ออมเดือนละ (บาท)
        </label>
        <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 rounded-lg px-2 py-0.5 focus-within:ring-2 focus-within:ring-indigo-500">
          <span className="text-xs font-bold text-indigo-600">฿</span>
          <input
            id="savings-input"
            type="number"
            min="0"
            max="100000"
            step="100"
            value={calcSavings || ""}
            onChange={(e) => setCalcSavings(Number(e.target.value))}
            className="w-20 text-xs font-extrabold text-indigo-600 bg-transparent text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0"
          />
        </div>
      </div>
      <input
        type="range"
        min="100"
        max="20000"
        step="100"
        value={calcSavings}
        onChange={(e) => setCalcSavings(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
      <div className="flex gap-1 mt-1.5">
        {[500, 1000, 3000, 5000].map((amount) => (
          <button
            key={amount}
            onClick={() => setCalcSavings(amount)}
            className={`text-[10px] px-2 py-0.5 rounded transition-all font-semibold ${
              calcSavings === amount
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ฿{amount.toLocaleString()}
          </button>
        ))}
      </div>
    </div>

    {/* Input 2: ระยะเวลา (ช่องพิมพ์ + Slider) */}
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label htmlFor="months-input" className="text-xs font-bold text-slate-700">
          ระยะเวลา (เดือน)
        </label>
        <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 rounded-lg px-2 py-0.5 focus-within:ring-2 focus-within:ring-indigo-500">
          <input
            id="months-input"
            type="number"
            min="1"
            max="120"
            value={calcMonths || ""}
            onChange={(e) => setCalcMonths(Number(e.target.value))}
            className="w-12 text-xs font-extrabold text-indigo-600 bg-transparent text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="1"
          />
          <span className="text-[10px] font-bold text-indigo-500">ด.</span>
        </div>
      </div>
      <input
        type="range"
        min="1"
        max="60"
        value={calcMonths}
        onChange={(e) => setCalcMonths(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
      <div className="flex gap-1 mt-1.5">
        {[6, 12, 24, 36, 60].map((m) => (
          <button
            key={m}
            onClick={() => setCalcMonths(m)}
            className={`text-[10px] px-2 py-0.5 rounded transition-all font-semibold ${
              calcMonths === m
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {m < 12 ? `${m} ด.` : `${m / 12} ปี`}
          </button>
        ))}
      </div>
    </div>

    {/* ผลลัพธ์การคำนวณ */}
    <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl flex items-center justify-between shadow-sm mt-2">
      <div>
        <span className="text-[10px] text-slate-400 font-medium block leading-none mb-0.5">
          ยอดเงินออมรวมในอนาคต 🚀
        </span>
        <span className="text-base font-extrabold text-emerald-400 tracking-tight leading-tight">
          ฿
          {Math.round(
            calcSavings * calcMonths * (1 + (0.03 * calcMonths) / 12)
          ).toLocaleString()}
        </span>
      </div>
      <div className="text-right border-l border-slate-700 pl-3">
        <span className="text-[10px] text-slate-400 block leading-none mb-0.5">เงินต้น</span>
        <span className="text-xs font-bold text-slate-200 leading-tight">
          ฿{(calcSavings * calcMonths).toLocaleString()}
        </span>
      </div>
    </div>
  </div>
</div>
            {/* Widget 4: เป้าหมายออมเงิน */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full text-indigo-200 font-medium">
                    เป้าหมายออมเงิน
                  </span>
                  <h4 className="text-base font-bold mt-2">
                    กองทุนเที่ยวปลายปี ✈️
                  </h4>
                </div>
                <span className="text-sm font-bold text-emerald-400">60%</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: "60%" }}
                />
              </div>
              <p className="text-xs text-slate-300 text-right font-medium">
                ฿6,000 / ฿10,000
              </p>
            </div>
            

            {/* Widget 5: สุขภาพทางการเงิน & Tips ประจำวัน */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-lg">❤️</span> สุขภาพทางการเงิน
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  ระดับ: สมดุลดี
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">อัตราการเก็บเงิน</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-slate-800">30%</span>
                    <span className="text-xs text-emerald-500 font-semibold">↑ +5%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[30%]" />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">งบประมาณคงเหลือ</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-slate-800">72%</span>
                    <span className="text-xs text-slate-400 font-medium">อีก 20 วัน</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[72%]" />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/90 rounded-xl p-3 flex items-start gap-2.5">
                <span className="text-base">💡</span>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Tip ประจำวัน</h4>
                  <p className="text-xs text-amber-800/90 leading-relaxed mt-0.5">
                    ตั้งเป้าตัดเงินออมทันทีที่รายรับเข้าบัญชีอย่างน้อย 10% ก่อนนำไปใช้จ่าย
                  </p>
                </div>
              </div>
            </div>

            {/* Widget 6: ข่าวสารการเงิน (แสดง 5 ข้อครบสมบูรณ์) */}
            <div className="bg-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3.5 rounded-xl mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://api.dicebear.com/7.x/bottts/svg?seed=FinanceBear&backgroundColor=b6e3f4"
                      alt="Cartoon Mascot"
                      className="w-10 h-10 rounded-full bg-white p-1 shadow-sm animate-bounce"
                      style={{ animationDuration: "3s" }}
                    />
                    <span className="absolute -top-1 -right-1 text-xs">✨</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                      ข่าวสารการเงินน่ารู้ 📰
                    </h3>
                    <p className="text-xs text-indigo-600 font-medium">
                      อัปเดตโดยน้องหมี Finance 🐻
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.sanook.com/money/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                >
                  ทั้งหมด <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                </a>
              </div>

              {/* รายการข่าวสาร 5 ข่าว */}
              <div className="space-y-2.5">
                {NEWS_DATA.map((news) => (
                  <a
                    key={news.id}
                    href={news.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${news.badgeColor}`}>
                        {news.tag}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        {news.date}
                        <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {news.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {news.summary}
                    </p>
                  </a>
                ))}
              </div>

              <div className="mt-4 pt-2 text-center border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
                  <span>🎯</span> อ่านวันละนิด ออมวันละหน่อย เพื่ออนาคตที่ดี!
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}