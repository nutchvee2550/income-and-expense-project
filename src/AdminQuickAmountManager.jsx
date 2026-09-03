import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function AdminQuickAmountManager() {
  const [newQuickAmount, setNewQuickAmount] = useState("");
  const [quickAmounts, setQuickAmounts] = useState([]);

  const API_BASE_URL = "http://localhost/Income%20and%20Expense%20Project/api";
  // ดึงข้อมูลปุ่มลัด
  const fetchQuickAmounts = () => {
    fetch(`${API_BASE_URL}/get_quick_amounts.php?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQuickAmounts(data);
      })
      .catch((err) => console.error("Fetch Quick Amounts Error:", err));
  };

  useEffect(() => {
    fetchQuickAmounts();
  }, []);

  // เพิ่มปุ่มลัด
  const handleAddQuickAmount = (e) => {
    e.preventDefault();

    const val = parseFloat(newQuickAmount);
    if (isNaN(val) || val <= 0) {
      Swal.fire({
        icon: "warning",
        title: "กรอกข้อมูลไม่ถูกต้อง",
        text: "กรุณาระบุจำนวนเงินที่เป็นตัวเลขมากกว่า 0",
      });
      return;
    }

    fetch(`${API_BASE_URL}/add_quick_amount.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: val }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setNewQuickAmount("");
          fetchQuickAmounts();

          Swal.fire({
            icon: "success",
            title: "เพิ่มปุ่มลัดสำเร็จ",
            timer: 1000,
            showConfirmButton: false,
          });
        } else {
          throw new Error(data.message || "Failed to add");
        }
      })
      .catch((err) => {
        console.error("Add Quick Amount Error:", err);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถเพิ่มปุ่มลัดได้",
        });
      });
  };

  // ลบปุ่มลัด (เพิ่มใหม่)
  const handleDeleteQuickAmount = (id) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: "ต้องการลบปุ่มลัดนี้ใช่หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ลบปุ่มลัด",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_BASE_URL}/delete_quick_amount.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") {
              fetchQuickAmounts();

              Swal.fire({
                icon: "success",
                title: "ลบปุ่มลัดเรียบร้อย",
                timer: 1000,
                showConfirmButton: false,
              });
            } else {
              throw new Error(data.message || "Failed to delete");
            }
          })
          .catch((err) => {
            console.error("Delete Quick Amount Error:", err);
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: "ไม่สามารถลบปุ่มลัดได้",
            });
          });
      }
    });
  };

  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-700">
        ⚡ จัดการปุ่มลัดจำนวนเงิน (ส่งไปยัง User)
      </h3>

      <form onSubmit={handleAddQuickAmount} className="flex gap-2">
        <input
          type="number"
          step="any"
          placeholder="ระบุจำนวนเงิน เช่น 20, 50, 200"
          value={newQuickAmount}
          onChange={(e) => setNewQuickAmount(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer"
        >
          + เพิ่มปุ่มลัด
        </button>
      </form>

      <div className="flex flex-wrap gap-2 pt-2">
        {quickAmounts.length > 0 ? (
          quickAmounts.map((item) => (
            <span
              key={item.id || item.amount}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-semibold"
            >
              +{item.amount}
              <button
                type="button"
                onClick={() => handleDeleteQuickAmount(item.id)}
                className="text-indigo-400 hover:text-rose-500 cursor-pointer transition-colors ml-1"
                title="ลบปุ่มลัด"
              >
                ✕
              </button>
            </span>
          ))
        ) : (
          <p className="text-xs text-slate-400">ไม่มีข้อมูลปุ่มลัด</p>
        )}
      </div>
    </div>
  );
}