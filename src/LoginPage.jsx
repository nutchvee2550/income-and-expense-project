import React, { useState } from "react";
import Swal from "sweetalert2";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // ตัวอย่างการเช็กสิทธิ์ Login (สามารถเปลี่ยนไปดึงจาก API PHP ได้)
    if (email === "admin@example.com" && password === "admin123") {
      const userData = { name: "ผู้ดูแลระบบ", role: "admin", email };
      localStorage.setItem("user", JSON.stringify(userData));
      onLogin(userData);
    } else if (email && password) {
      const userData = { name: "วีรศันต์", role: "user", email };
      localStorage.setItem("user", JSON.stringify(userData));
      onLogin(userData);
    } else {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: "กรุณากรอก Email และ Password",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">เข้าสู่ระบบ</h2>
          <p className="text-xs text-slate-400 mt-1">กระเป๋าเงินของฉัน (Income & Expense)</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">อีเมล</label>
            <input
              type="email"
              placeholder="admin@example.com หรือ user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-all cursor-pointer text-sm"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
          <p className="font-semibold text-slate-600">บัญชีสำหรับทดสอบ:</p>
          <p>• Admin: admin@example.com / admin123</p>
          <p>• User: user@example.com / รหัสผ่านใดก็ได้</p>
        </div>
      </div>
    </div>
  );
}