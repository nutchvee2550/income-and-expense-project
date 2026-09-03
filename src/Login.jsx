import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State สำหรับดูรหัสผ่าน และสลับธีม
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

const API_BASE_URL = "http://localhost/Income%20and%20Expense%20Project/api";

const handleLogin = (e) => {
  e.preventDefault();
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    setLoading(true);

    fetch(`${API_BASE_URL}/login.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "เข้าสู่ระบบสำเร็จ!",
            timer: 1200,
            showConfirmButton: false,
          });

          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }

          if (onLoginSuccess) {
            onLoginSuccess(data.user);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "เข้าสู่ระบบไม่สำเร็จ",
            text: data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
            confirmButtonColor: "#4f46e5",
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Login Error:", err);
        Swal.fire({
          icon: "error",
          title: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้",
          text: "กรุณาลองใหม่อีกครั้งในภายหลัง",
          confirmButtonColor: "#4f46e5",
        });
      });
  };

  return (
    <>
      {/* นำเข้าฟอนต์ทางการ (Sarabun) จาก Google Fonts */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap');`}
      </style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: isDarkMode ? "#0f172a" : "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          fontFamily: "'Sarabun', sans-serif",
          boxSizing: "border-box",
          position: "relative",
          transition: "background-color 0.3s ease",
        }}
      >
        {/* ปุ่มสลับธีม ขาว - ดำ */}
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            padding: "8px 14px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
            color: isDarkMode ? "#f1f5f9" : "#0f172a",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "'Sarabun', sans-serif",
          }}
        >
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
            borderRadius: "24px",
            boxShadow: isDarkMode 
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.5)" 
              : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            padding: "32px 24px",
            boxSizing: "border-box",
            transition: "background-color 0.3s ease",
          }}
        >
          {/* โลโก้ & ส่วนหัว */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                margin: "0 auto 12px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src="/Logo.png"
                alt="ตราวิทยาลัย"
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
              />
            </div>

            <h2
              style={{
                fontSize: "22px",
                fontWeight: "800",
                color: isDarkMode ? "#ffffff" : "#1e293b",
                margin: "0 0 6px 0",
              }}
            >
              กระเป๋าเงินของฉัน
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "#6366f1",
                fontWeight: "600",
                margin: "0 0 2px 0",
              }}
            >
              วิทยาลัยเทคโนโลยีอุดมศึกษาพาณิชยการ
            </p>
            <p style={{ fontSize: "12px", color: isDarkMode ? "#94a3b8" : "#64748b", margin: 0 }}>
              ระบบบันทึกรายรับ-รายจ่าย
            </p>
          </div>

          {/* ฟอร์มเข้าสู่ระบบ */}
          <form onSubmit={handleLogin}>
            {/* Username */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: isDarkMode ? "#cbd5e1" : "#475569",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                ชื่อผู้ใช้งาน (Username)
              </label>
              <input
                type="text"
                placeholder="กรอกชื่อผู้ใช้งาน"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: isDarkMode ? "1px solid #334155" : "1px solid #cbd5e1",
                  backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
                  fontSize: "14px",
                  color: isDarkMode ? "#ffffff" : "#1e293b",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "'Sarabun', sans-serif",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: isDarkMode ? "#cbd5e1" : "#475569",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                รหัสผ่าน (Password)
              </label>
              
              {/* Wrapper ใส่ปุ่มเปิด/ปิดตา */}
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 42px 12px 14px",
                    borderRadius: "12px",
                    border: isDarkMode ? "1px solid #334155" : "1px solid #cbd5e1",
                    backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
                    fontSize: "14px",
                    color: isDarkMode ? "#ffffff" : "#1e293b",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'Sarabun', sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: isDarkMode ? "#94a3b8" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* ปุ่มล็อกอิน */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                fontWeight: "700",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                transition: "background-color 0.2s",
                fontFamily: "'Sarabun', sans-serif",
              }}
            >
              {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* ฟุตเตอร์ */}
          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              borderTop: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9",
              paddingTop: "12px",
            }}
          >
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
             
            </p>
          </div>
        </div>
      </div>
    </>
  );
}