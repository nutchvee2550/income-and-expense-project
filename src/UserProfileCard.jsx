import React from "react";
import Swal from "sweetalert2";

export default function UserProfileCard({ user, onLogout }) {
  // ฟังก์ชันจัดการการออกจากระบบพร้อม SweetAlert2
  const handleLogout = () => {
    Swal.fire({
      title: "ยืนยันการออกจากระบบ?",
      text: "คุณต้องการออกจากระบบใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      customClass: {
        popup: "rounded-3xl",
        confirmButton: "rounded-xl font-semibold",
        cancelButton: "rounded-xl font-semibold",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (onLogout) {
          onLogout();
        } else {
          // ตัวอย่างการลบ Token / Session
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
      {/* ข้อมูลผู้ใช้งาน */}
      <div className="flex items-center gap-3.5">
        <div className="relative">
          <img
            src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=weerasan"}
            alt="User Avatar"
            className="w-12 h-12 rounded-2xl bg-slate-100 object-cover border border-slate-200"
          />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            {user?.name || "weerasan"}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </div>

      {/* ปุ่มออกจากระบบ (ดีไซน์ตามภาพ) */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-300 rounded-full text-xs font-bold transition-all active:scale-95 shadow-sm hover:shadow cursor-pointer"
      >
        <i className="fa-solid fa-right-from-bracket text-sm"></i>
        <span>ออกจากระบบ</span>
      </button>
    </div>
  );
}