import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

// นำเข้า Chart.js และ react-chartjs-2
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// ลงทะเบียน Chart.js Components
ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// =====================================================
// ค่าคงที่และฟังก์ชันจัดการวันที่แบบ Safe Format (แก้บัคเรื่องวันที่)
// =====================================================
const THAI_MONTHS_FULL = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const THAI_MONTHS_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

const THAI_DAYS = [
  "อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"
];

// แปลง YYYY-MM-DD เป็นข้อความภาษาไทย "วันพฤหัสบดีที่ 3 กันยายน 2569"
const formatChartDate = (dateString) => {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month index 0-11
  const day = parseInt(parts[2], 10);

  const d = new Date(year, month, day);
  const dayOfWeek = THAI_DAYS[d.getDay()];
  const monthName = THAI_MONTHS_FULL[month];
  const thaiYear = year + 543;

  return `วัน${dayOfWeek}ที่ ${day} ${monthName} ${thaiYear}`;
};

// =====================================================
// ฟังก์ชันสุ่มสีจากชื่อหมวดหมู่ (HEX)
// =====================================================
const COLOR_PALETTE = [
  "#6366f1", // Indigo
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#10b981", // Emerald
  "#a855f7", // Purple
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#ec4899", // Pink
  "#84cc16", // Lime
  "#14b8a6", // Teal
];

const getCategoryColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
};

// =====================================================
// DailyBudgetCard Component
// =====================================================
function DailyBudgetCard({ transactions = [] }) {
  const [dailyBudget, setDailyBudget] = useState(() => {
    const saved = localStorage.getItem("dailyBudget");
    return saved ? Number(saved) : 300;
  });

  const handleBudgetChange = (val) => {
    const num = Number(val) || 0;
    setDailyBudget(num);
    localStorage.setItem("dailyBudget", num.toString());
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  
  const todayExpense = transactions
    .filter((t) => t.type === "expense" && t.rawDate === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBudget = dailyBudget - todayExpense;
  const isOverBudget = remainingBudget < 0;
  const isWarning = remainingBudget >= 0 && remainingBudget <= dailyBudget * 0.2;

  const getThemeConfig = () => {
    if (isOverBudget) {
      return {
        bgColor: "#e11d48",
        borderColor: "transparent",
        icon: "fa-circle-xmark",
        dotClass: "bg-white animate-ping",
        message: "วันนี้คุณใช้เงินเกินงบประมาณแล้ว!",
      };
    }
    if (isWarning) {
      return {
        bgColor: "#d97706",
        borderColor: "transparent",
        icon: "fa-triangle-exclamation",
        dotClass: "bg-white",
        message: "ระวัง! งบประมาณใกล้จะหมดแล้ว",
      };
    }
    return {
      bgColor: "#059669",
      borderColor: "transparent",
      icon: "fa-circle-check",
      dotClass: "bg-white",
      message: "วันนี้คุณยังมีเงินเหลือใช้!",
    };
  };

  const config = getThemeConfig();

  return (
    <div
      style={{ backgroundColor: config.bgColor, borderColor: config.borderColor }}
      className="rounded-3xl p-5 border-none text-white transition-all duration-300 shadow-md drop-shadow-sm"
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-white/30">
        <div className="flex items-center gap-2.5">
          <i className={`fa-solid ${config.icon} text-xl text-white drop-shadow-sm`}></i>
          <span className="font-extrabold text-base text-white tracking-wide drop-shadow-sm">
            งบประมาณประจำวันนี้
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white shadow-inner">
          <span className="text-xs text-white font-bold tracking-wider">ตั้งงบ:</span>
          <input
            type="number"
            value={dailyBudget}
            onChange={(e) => handleBudgetChange(e.target.value)}
            className="w-16 text-center font-extrabold text-sm text-white bg-transparent focus:outline-none placeholder-white drop-shadow-sm"
          />
          <span className="text-xs text-white font-bold">บาท</span>
        </div>
      </div>

      <div className="pt-3.5 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`w-3 h-3 rounded-full ${config.dotClass} shadow-sm`}></span>
            <p className="text-sm font-extrabold text-white tracking-wide drop-shadow-sm">
              {config.message}
            </p>
          </div>
          <p className="text-xs font-semibold text-white/95 drop-shadow-sm">
            ใช้ไปแล้ว <span className="font-bold underline decoration-white/40">฿{todayExpense.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span> จากงบ ฿{dailyBudget.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-white/90 block font-bold uppercase tracking-wider drop-shadow-sm">
            คงเหลือวันนี้
          </span>
          <p className="text-2xl font-black tracking-tight text-white drop-shadow-md">
            ฿{remainingBudget.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Main ExpenseTracker Component
// =====================================================
export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState([]);
  const [currentType, setCurrentType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [dbCategories, setDbCategories] = useState([]);
  const [quickAmounts, setQuickAmounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // กำหนดวันเริ่มต้นด้วย Format YYYY-MM-DD ให้ตรงกัน
  const getTodayISO = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };

  const [selectedIncomeChartDate, setSelectedIncomeChartDate] = useState(getTodayISO);
  const [selectedChartDate, setSelectedChartDate] = useState(getTodayISO);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_BASE_URL = "http://localhost/Income%20and%20Expense%20Project/api";

  const handleLogout = () => {
    Swal.fire({
      title: '<span style="font-size: 22px; font-weight: 800; color: #1e293b;">ออกจากระบบ?</span>',
      html: '<span style="font-size: 14px; color: #64748b; font-weight: 500;">คุณต้องการออกจากระบบผู้ดูแลและระบบใช่หรือไม่</span>',
      icon: 'warning',
      iconColor: '#f97316',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4d',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      customClass: {
        popup: 'rounded-[32px] p-6 shadow-2xl',
        confirmButton: 'rounded-2xl px-6 py-3 font-bold text-sm shadow-md transition-all active:scale-95',
        cancelButton: 'rounded-2xl px-6 py-3 font-bold text-sm transition-all active:scale-95',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        sessionStorage.clear();
        Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบสำเร็จ',
          timer: 1000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-[28px]' }
        }).then(() => {
          window.location.href = '/login';
        });
      }
    });
  };

  const fetchQuickAmounts = () => {
    fetch(`${API_BASE_URL}/get_quick_amounts.php?t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch quick amounts error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const amounts = data
            .map((item) => parseFloat(item.amount))
            .filter((val) => !isNaN(val))
            .sort((a, b) => a - b);
          setQuickAmounts(amounts.length > 0 ? amounts : [20, 50, 100, 500, 1000]);
        } else {
          setQuickAmounts([20, 50, 100, 500, 1000]);
        }
      })
      .catch((err) => {
        console.error("Fetch Quick Amounts Error:", err);
        setQuickAmounts([20, 50, 100, 500, 1000]);
      });
  };

  const fetchCategories = () => {
    fetch(`${API_BASE_URL}/get_categories.php?t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch categories error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setDbCategories(data);
      })
      .catch((err) => console.error("Fetch Categories Error:", err));
  };

  const fetchTransactions = () => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/get_transactions.php?t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const formattedData = data.map((t) => {
            const rawDateObj = new Date(t.created_at || t.date || Date.now());
            const localYear = rawDateObj.getFullYear();
            const localMonth = String(rawDateObj.getMonth() + 1).padStart(2, "0");
            const localDay = String(rawDateObj.getDate()).padStart(2, "0");
            const localRawDate = `${localYear}-${localMonth}-${localDay}`;
            return {
              id: t.id,
              type: t.type || "expense",
              category: t.category || "ทั่วไป",
              amount: parseFloat(t.amount) || 0,
              title: t.note || t.title || t.category || "ไม่ระบุรายการ",
              rawDate: localRawDate,
              date: `${rawDateObj.getDate()} ${THAI_MONTHS_SHORT[rawDateObj.getMonth()]} ${rawDateObj.getFullYear() + 543}`,
            };
          });
          setTransactions(formattedData);
        }
      })
      .catch((err) => console.error("Fetch Error:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
    fetchQuickAmounts();
  }, []);

  const availableCategories = dbCategories.filter((c) => c.type === currentType);

  useEffect(() => {
    if (availableCategories.length > 0) {
      setCategory(availableCategories[0].name);
    } else {
      setCategory("");
    }
  }, [currentType, dbCategories]);

  const handleQuickAmount = (val) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  const handleClearAmount = () => {
    if (!amount) return;
    setAmount("");
    Swal.fire({
      icon: "success",
      title: "ล้างจำนวนเงินแล้ว",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกรายละเอียดและจำนวนเงินให้ถูกต้องครับ",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const payload = {
      type: currentType,
      category: category || "ทั่วไป",
      amount: parsedAmount,
      note: title.trim(),
    };

    fetch(`${API_BASE_URL}/add_transaction.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setTitle("");
          setAmount("");
          fetchTransactions();
          Swal.fire({
            icon: "success",
            title: "บันทึกรายการเรียบร้อย!",
            text: `เพิ่มรายการ "${payload.note}" จำนวน ${parsedAmount.toLocaleString("th-TH")} บาท แล้ว`,
            timer: 1200,
            showConfirmButton: false,
          });
        } else {
          throw new Error(data.message || "Failed to save");
        }
      })
      .catch((err) => {
        console.error("Save Error:", err);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถบันทึกข้อมูลไปยังฐานข้อมูลได้",
        });
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: "รายการนี้จะถูกลบ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ลบรายการ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_BASE_URL}/delete_transaction.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") {
              fetchTransactions();
              Swal.fire({
                icon: "success",
                title: "ลบเรียบร้อย!",
                timer: 1000,
                showConfirmButton: false,
              });
            } else {
              throw new Error(data.message || "Failed to delete");
            }
          })
          .catch((err) => {
            console.error("Delete Error:", err);
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: "ไม่สามารถลบรายการได้",
            });
          });
      }
    });
  };

  const handleDeleteAll = () => {
    Swal.fire({
      title: "ล้างรายการทั้งหมด?",
      text: "ทุกรายการจะถูกลบหมด",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ลบทั้งหมด",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_BASE_URL}/delete_all_transactions.php`, { method: "POST" })
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Network response was not ok");
            return data;
          })
          .then((data) => {
            if (data.status === "success") {
              fetchTransactions();
              Swal.fire({
                icon: "success",
                title: "ล้างรายการทั้งหมดเรียบร้อย!",
                timer: 1200,
                showConfirmButton: false,
              });
            } else {
              throw new Error(data.message || "Failed to delete all");
            }
          })
          .catch((err) => {
            console.error("Delete All Error:", err);
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: err.message || "ไม่สามารถล้างรายการทั้งหมดได้",
            });
          });
      }
    });
  };

  // =====================================================
  // คำนวณสรุปภาพรวม
  // =====================================================
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // =====================================================
  // คำนวณข้อมูลรายรับประจำวันที่เลือก
  // =====================================================
  const incomeChartDates = Array.from(
    new Set(
      transactions
        .filter((t) => t.type === "income" && t.rawDate)
        .map((t) => t.rawDate)
    )
  ).sort((a, b) => b.localeCompare(a));

  const selectedDateIncomes = transactions.filter(
    (t) => t.type === "income" && t.rawDate === selectedIncomeChartDate
  );

  const selectedDateIncomeSummary = selectedDateIncomes
    .reduce((acc, t) => {
      const existing = acc.find((c) => c.name === t.category);
      if (existing) {
        existing.amount += t.amount;
      } else {
        const catObj = dbCategories.find((c) => c.name === t.category);
        acc.push({
          name: t.category,
          amount: t.amount,
          icon: catObj ? catObj.icon : "💰",
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount);

  const selectedDateIncomeTotal = selectedDateIncomeSummary.reduce(
    (sum, cat) => sum + cat.amount,
    0
  );

  // =====================================================
  // คำนวณข้อมูลรายจ่ายประจำวันที่เลือก
  // =====================================================
  const chartDates = Array.from(
    new Set(
      transactions
        .filter((t) => t.type === "expense" && t.rawDate)
        .map((t) => t.rawDate)
    )
  ).sort((a, b) => b.localeCompare(a));

  const selectedDateExpenses = transactions.filter(
    (t) => t.type === "expense" && t.rawDate === selectedChartDate
  );

  const selectedDateExpenseSummary = selectedDateExpenses
    .reduce((acc, t) => {
      const existing = acc.find((c) => c.name === t.category);
      if (existing) {
        existing.amount += t.amount;
      } else {
        const catObj = dbCategories.find((c) => c.name === t.category);
        acc.push({
          name: t.category,
          amount: t.amount,
          icon: catObj ? catObj.icon : "🏷️",
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount);

  const selectedDateExpenseTotal = selectedDateExpenseSummary.reduce(
    (sum, cat) => sum + cat.amount,
    0
  );

  // =====================================================
  // โครงสร้างข้อมูล Chart.js
  // =====================================================
  const summaryBarData = {
    labels: ["รายรับ", "รายจ่าย"],
    datasets: [
      {
        label: "จำนวนเงิน (บาท)",
        data: [totalIncome, totalExpense],
        backgroundColor: ["#10b981", "#f43f5e"],
        borderRadius: 8,
      },
    ],
  };

  const summaryBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Doughnut - รายรับตามวันที่เลือก
  const incomeDoughnutData = {
    labels: selectedDateIncomeSummary.map((item) => item.name),
    datasets: [
      {
        data: selectedDateIncomeSummary.map((item) => item.amount),
        backgroundColor: selectedDateIncomeSummary.map((item) => getCategoryColor(item.name)),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // Doughnut - รายจ่ายตามวันที่เลือก
  const expenseDoughnutData = {
    labels: selectedDateExpenseSummary.map((item) => item.name),
    datasets: [
      {
        data: selectedDateExpenseSummary.map((item) => item.amount),
        backgroundColor: selectedDateExpenseSummary.map((item) => getCategoryColor(item.name)),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: { size: 12 },
          boxWidth: 12,
        },
      },
    },
  };

  // Pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1;
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Card ยอดเงินรวม */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-900 text-white rounded-[2rem] p-6 shadow-2xl shadow-indigo-500/20 relative overflow-hidden border-none">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-indigo-200/90 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ยอดเงินคงเหลือสุทธิ
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full text-indigo-100 font-medium border-none">
                THB (฿)
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-rose-50 text-rose-500 font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95 border-none"
              >
                <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-7 text-white drop-shadow-sm flex items-baseline gap-1">
            <span className="text-2xl text-indigo-200 font-semibold">฿</span>
            {balance.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </h2>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-white/10 backdrop-blur-xl border-none rounded-2xl p-4 shadow-inner hover:bg-white/[0.14] transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-xs font-bold">
                  ↓
                </div>
                <span className="text-xs text-indigo-100 font-medium">รายรับรวม</span>
              </div>
              <p className="text-base font-bold text-emerald-300 tracking-tight">
                +฿{totalIncome.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border-none rounded-2xl p-4 shadow-inner hover:bg-white/[0.14] transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-xl bg-rose-400/20 text-rose-300 flex items-center justify-center text-xs font-bold">
                  ↑
                </div>
                <span className="text-xs text-indigo-100 font-medium">รายจ่ายรวม</span>
              </div>
              <p className="text-base font-bold text-rose-300 tracking-tight">
                -฿{totalExpense.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* บัดเจ็ตรายวัน */}
      <DailyBudgetCard transactions={transactions} />

      {/* กราฟแท่งภาพรวม รายรับ vs รายจ่าย */}
      <div className="bg-white rounded-3xl p-6 border-none shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <i className="fa-solid fa-chart-column text-indigo-500"></i> เปรียบเทียบภาพรวม (รายรับ VS รายจ่าย)
        </h3>
        <div className="h-64 w-full relative">
          <Bar data={summaryBarData} options={summaryBarOptions} />
        </div>
      </div>

      {/* สรุปตามหมวดหมู่รายรับประจำวัน (ธีมสีเขียว Emerald) */}
        <div className="bg-white rounded-3xl p-6 border-none shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
              <i className="fa-solid fa-chart-pie text-emerald-500"></i> สรุปรายรับตามวัน
            </h3>

            <div className="flex items-center gap-2">
              <label htmlFor="income-chart-date" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                เลือกวัน
              </label>
              <input
                id="income-chart-date"
                type="date"
                value={selectedIncomeChartDate}
                onChange={(e) => setSelectedIncomeChartDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-50 rounded-2xl px-4 py-3">
            <div>
              <p className="text-[11px] text-emerald-600 font-semibold">วันที่เลือก</p>
              <p className="text-sm font-extrabold text-emerald-800">{formatChartDate(selectedIncomeChartDate)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-emerald-600 font-semibold">รายรับของวัน</p>
              <p className="text-lg font-black text-emerald-600">
                ฿{selectedDateIncomeTotal.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* ปุ่มเลือกวันย้อนหลังด่วน (Quick Date) สำหรับ รายรับ */}
          {incomeChartDates.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {incomeChartDates.slice(0, 7).map((date) => {
                const parts = date.split("-").map(Number);
                const day = parts[2];
                const monthShort = THAI_MONTHS_SHORT[parts[1] - 1];
                const isSelected = selectedIncomeChartDate === date;

                return (
                  <button
                    key={`inc-date-${date}`}
                    type="button"
                    onClick={() => setSelectedIncomeChartDate(date)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? "!bg-emerald-600 !text-white !border-emerald-600 shadow-sm"
                        : "!bg-slate-100 !text-slate-700 !border-slate-200 hover:!bg-emerald-100 hover:!text-emerald-800"
                    }`}
                  >
                    {`${day} ${monthShort}`}
                  </button>
                );
              })}
            </div>
          )}

          {/* ส่วนแสดงกราฟวงกลม */}
          <div className="h-[220px] w-full relative">
            {selectedDateIncomeSummary.length > 0 ? (
              <Doughnut data={incomeDoughnutData} options={doughnutOptions} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <i className="fa-regular fa-calendar-xmark text-3xl text-slate-300 mb-2"></i>
                <p className="text-xs text-slate-400">วันที่นี้ยังไม่มีรายการรายรับ</p>
              </div>
            )}
          </div>

          {/* ส่วนแสดงรายการหมวดหมู่และ Percent Bar */}
          <div className="space-y-4">
            {selectedDateIncomeSummary.map((cat) => {
              const percentage = selectedDateIncomeTotal > 0
                ? Math.round((cat.amount / selectedDateIncomeTotal) * 100)
                : 0;
              const hexColor = getCategoryColor(cat.name);
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-emerald-600 font-bold">
                      +฿{cat.amount.toLocaleString("th-TH")} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: hexColor,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      {/* ===================================================== */}
      {/* สรุปตามหมวดหมู่รายจ่ายประจำวัน (ธีมสีม่วง/น้ำเงิน Indigo) */}
      {/* ===================================================== */}
      <div className="bg-white rounded-3xl p-6 border-none shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
            <i className="fa-solid fa-chart-pie text-indigo-500"></i> สรุปรายจ่ายตามวัน
          </h3>

          <div className="flex items-center gap-2">
            <label htmlFor="expense-chart-date" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              เลือกวัน
            </label>
            <input
              id="expense-chart-date"
              type="date"
              value={selectedChartDate}
              onChange={(e) => setSelectedChartDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-50 rounded-2xl px-4 py-3">
          <div>
            <p className="text-[11px] text-indigo-400 font-semibold">วันที่เลือก</p>
            <p className="text-sm font-extrabold text-indigo-700">{formatChartDate(selectedChartDate)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-indigo-400 font-semibold">รายจ่ายของวัน</p>
            <p className="text-lg font-black text-rose-600">
              ฿{selectedDateExpenseTotal.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* ปุ่มเลือกวันย้อนหลังด่วน (Quick Date) สำหรับ รายจ่าย */}
        {chartDates.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chartDates.slice(0, 7).map((date) => {
              const parts = date.split("-").map(Number);
              const day = parts[2];
              const monthShort = THAI_MONTHS_SHORT[parts[1] - 1];
              const isSelected = selectedChartDate === date;

              return (
                <button
                  key={`exp-date-${date}`}
                  type="button"
                  onClick={() => setSelectedChartDate(date)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {`${day} ${monthShort}`}
                </button>
              );
            })}
          </div>
        )}

        <div className="h-[220px] w-full relative">
          {selectedDateExpenseSummary.length > 0 ? (
            <Doughnut data={expenseDoughnutData} options={doughnutOptions} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <i className="fa-regular fa-calendar-xmark text-3xl text-slate-300 mb-2"></i>
              <p className="text-xs text-slate-400">วันที่นี้ยังไม่มีรายการรายจ่าย</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {selectedDateExpenseSummary.map((cat) => {
            const percentage = selectedDateExpenseTotal > 0
              ? Math.round((cat.amount / selectedDateExpenseTotal) * 100)
              : 0;
            const hexColor = getCategoryColor(cat.name);
            return (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                  <span className="text-slate-500 font-bold">
                    ฿{cat.amount.toLocaleString("th-TH")} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: hexColor,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ฟอร์มบันทึกรายการ */}
      <div className="bg-white rounded-3xl p-6 border-none shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          บันทึกรายการใหม่
        </h3>
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCurrentType("expense")}
            className={`py-2.5 rounded-xl transition-all border-none ${
              currentType === "expense"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <i className="fa-solid fa-circle-minus mr-1.5"></i> รายจ่าย
          </button>
          <button
            type="button"
            onClick={() => setCurrentType("income")}
            className={`py-2.5 rounded-xl transition-all border-none ${
              currentType === "income"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <i className="fa-solid fa-circle-plus mr-1.5"></i> รายรับ
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">หมวดหมู่</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {availableCategories.length > 0 ? (
                availableCategories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))
              ) : (
                <option value="">-- ไม่มีหมวดหมู่ --</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">จำนวนเงิน (บาท)</label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-base font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickAmounts.map((val, idx) => (
                <button
                  key={`quick-${val}-${idx}`}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-xl text-xs font-semibold border-none transition-all active:scale-95 cursor-pointer"
                >
                  +{val}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearAmount}
                className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl text-xs font-semibold border-none transition-all active:scale-95 ml-auto cursor-pointer"
              >
                ล้าง
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">รายละเอียด / หมายเหตุ</label>
            <input
              type="text"
              placeholder="เช่น ค่าอาหารกลางวัน, ค่าน้ำมัน"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer border-none"
          >
            <i className="fa-solid fa-check"></i> บันทึกรายการ
          </button>
        </form>
      </div>

      {/* รายการย้อนหลัง + Pagination & Loading */}
      <div className="bg-white rounded-3xl p-6 border-none shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">รายการล่าสุด</h3>
          {transactions.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border-none"
            >
              <i className="fa-solid fa-trash-can"></i> ล้างรายการทั้งหมด
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-6 text-slate-400 text-xs flex items-center justify-center gap-2">
            <i className="fa-solid fa-spinner animate-spin text-indigo-500"></i> กำลังโหลดข้อมูล...
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            ยังไม่มีรายการบันทึก
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedTransactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                      t.type === "income"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{t.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <span>{t.category}</span>
                      <span>•</span>
                      <span>{t.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-extrabold ${
                      t.type === "income" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}฿
                    {t.amount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                  </span>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors p-1 rounded-lg cursor-pointer border-none bg-transparent"
                    title="ลบรายการ"
                  >
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  ก่อนหน้า
                </button>
                <span className="text-xs font-medium text-slate-500">
                  หน้า {currentPage} จาก {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  ถัดไป
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}