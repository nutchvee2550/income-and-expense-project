import React, { useState, useEffect } from 'react';

// ==========================================
// Config & Constants
// ==========================================
const API_BASE_URL = "http://localhost/Income%20and%20Expense%20Project/api";

// ==========================================
// CSS Animations & Global Styles + Google Fonts Import
// ==========================================
const ModalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800&family=Prompt:wght@300;400;500;600;700;800&display=swap');

    * {
      font-family: 'Prompt', 'Kanit', sans-serif !important;
    }

    @keyframes modalOverlayFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes modalPopUp {
      0% {
        opacity: 0;
        transform: scale(0.85) translateY(20px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    .btn-action-hover:hover {
      transform: translateY(-2px);
      opacity: 0.95;
    }
    .btn-action-hover:active {
      transform: translateY(0);
    }

    /* ===== Admin Dashboard Layout ===== */
    .admin-page {
      min-height: 100vh;
    }

    .admin-container {
      width: min(1180px, 100%);
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .admin-header {
      border-radius: 1.5rem !important;
      padding: 1.5rem 1.75rem !important;
    }

    .admin-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .admin-stat-card {
      min-width: 0;
      padding: 1.25rem 1.4rem !important;
      border-radius: 1.25rem !important;
    }

    .admin-section {
      background: #ffffff;
      padding: 1.35rem !important;
      border-radius: 1.25rem !important;
      border: 1px solid #f1f5f9;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.03);
    }

    .category-form {
      display: grid !important;
      grid-template-columns: 150px 58px minmax(180px, 1fr) auto;
      gap: .6rem !important;
      align-items: center;
    }

    .category-list {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: .6rem !important;
      padding-top: 1.1rem !important;
    }

    .category-item {
      min-width: 0;
      display: flex !important;
      align-items: center;
      justify-content: space-between;
      gap: .5rem;
      border-radius: .9rem !important;
      padding: .55rem .75rem !important;
    }

    .quick-form {
      display: grid !important;
      grid-template-columns: minmax(180px, 1fr) auto;
      gap: .6rem !important;
      align-items: center;
    }

    .quick-list {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: .6rem !important;
      padding-top: 1.1rem !important;
    }

    .quick-item {
      min-width: 0;
      justify-content: space-between !important;
      border-radius: .9rem !important;
    }

    @media (max-width: 900px) {
      .admin-stats {
        grid-template-columns: 1fr;
      }

      .category-form {
        grid-template-columns: 150px 58px 1fr;
      }

      .category-form button {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 640px) {
      .admin-page {
        padding: 1rem .75rem 2rem !important;
      }

      .admin-container {
        gap: .85rem;
      }

      .admin-header {
        padding: 1.25rem !important;
        border-radius: 1.25rem !important;
      }

      .admin-header h1 {
        font-size: 1.35rem !important;
      }

      .admin-section {
        padding: 1rem !important;
      }

      .category-form,
      .quick-form {
        grid-template-columns: 1fr !important;
      }

      .category-form > *,
      .quick-form > * {
        width: 100% !important;
        min-width: 0 !important;
      }

      .category-form button,
      .quick-form button {
        grid-column: auto !important;
      }
    }

  `}</style>
);

// ==========================================
// SVG Icons Component
// ==========================================
const Icons = {
  Logout: () => (
    <svg className="w-5 h-5 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  TrendUp: () => (
    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  TrendDown: () => (
    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
    </svg>
  ),
  Wallet: () => (
    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
};

// ==========================================
// Modal Component: Universal Action/Alert Modal
// ==========================================
function ActionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "ตกลง", 
  cancelText = "ยกเลิก", 
  type = "warning", // 'warning', 'success', 'error'
  showCancel = true 
}) {
  if (!isOpen) return null;

  const getTheme = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✓',
          borderColor: '#bbf7d0',
          iconColor: '#22c55e',
          btnColor: '#22c55e',
          shadow: 'rgba(34, 197, 94, 0.35)'
        };
      case 'error':
        return {
          icon: '✕',
          borderColor: '#fecaca',
          iconColor: '#ef4444',
          btnColor: '#ef4444',
          shadow: 'rgba(239, 68, 68, 0.35)'
        };
      case 'warning':
      default:
        return {
          icon: '!',
          borderColor: '#fed7aa',
          iconColor: '#f97316',
          btnColor: '#ef4444',
          shadow: 'rgba(249, 115, 22, 0.35)'
        };
    }
  };

  const theme = getTheme();

  return (
    <>
      <ModalStyles />
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1rem",
          animation: "modalOverlayFadeIn 0.25s ease-out forwards",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "2.5rem",
            padding: "3rem 2.5rem 2.5rem 2.5rem",
            maxWidth: "440px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            animation: "modalPopUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          {/* Icon Box */}
          <div
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              border: `4px solid ${theme.borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem auto",
              backgroundColor: "#fff",
            }}
          >
            <span style={{ fontSize: "3.5rem", fontWeight: "300", color: theme.iconColor, lineHeight: 1 }}>
              {theme.icon}
            </span>
          </div>

          <h3 style={{ fontSize: "1.85rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            {title}
          </h3>
          
          {description && (
            <p style={{ fontSize: "1.05rem", color: "#64748b", marginBottom: "2.5rem", fontWeight: "500" }}>
              {description}
            </p>
          )}

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            {showCancel && (
              <button
                type="button"
                className="btn-action-hover"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "1rem 1.5rem",
                  backgroundColor: "#64748b",
                  color: "#ffffff",
                  fontWeight: "700",
                  borderRadius: "1rem",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.05rem",
                  transition: "all 0.2s ease"
                }}
              >
                {cancelText}
              </button>
            )}
            <button
              type="button"
              className="btn-action-hover"
              onClick={onConfirm || onClose}
              style={{
                flex: 1,
                padding: "1rem 1.5rem",
                backgroundColor: theme.btnColor,
                color: "#ffffff",
                fontWeight: "700",
                borderRadius: "1rem",
                border: "none",
                cursor: "pointer",
                fontSize: "1.05rem",
                boxShadow: `0 4px 14px ${theme.shadow}`,
                transition: "all 0.2s ease"
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ==========================================
// Component: AdminQuickAmountManager
// ==========================================
function AdminQuickAmountManager({ quickAmounts, onRefresh, onDeleteClick, showAlert }) {
  const [newQuickAmount, setNewQuickAmount] = useState('');

  const handleAddQuickAmount = async (e) => {
    e.preventDefault();
    if (!newQuickAmount || isNaN(newQuickAmount) || Number(newQuickAmount) <= 0) {
      return showAlert('กรอกข้อมูลไม่ถูกต้อง', 'กรุณาระบุจำนวนเงินให้ถูกต้องก่อนทำรายการ', 'warning');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/add_quick_amount.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(newQuickAmount) })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setNewQuickAmount('');
        onRefresh();
        showAlert('เพิ่มสำเร็จ!', `เพิ่มปุ่มลัดจำนวนเงิน +${newQuickAmount} เรียบร้อยแล้ว`, 'success');
      } else {
        showAlert('เกิดข้อผิดพลาด', data.message || "ไม่สามารถเพิ่มปุ่มลัดได้", 'error');
      }
    } catch (err) {
      console.error("Add quick amount error:", err);
      showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error');
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '1.75rem',
      borderRadius: '1.5rem',
      border: '1px solid #f1f5f9',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.03)'
    }}>
      <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #f8fafc', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ backgroundColor: '#fef3c7', padding: '0.35rem 0.6rem', borderRadius: '0.75rem', fontSize: '1.1rem' }}>⚡</span>
          จัดการปุ่มลัดจำนวนเงิน
        </h2>
      </div>

      <form className="quick-form" onSubmit={handleAddQuickAmount} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <input
          type="number"
          placeholder="ระบุจำนวนเงิน เช่น 20, 50, 200"
          value={newQuickAmount}
          onChange={(e) => setNewQuickAmount(e.target.value)}
          style={{
            flex: 1,
            padding: '0.85rem 1.25rem',
            border: '1.5px solid #e2e8f0',
            borderRadius: '1rem',
            fontSize: '0.9rem',
            backgroundColor: '#f8fafc',
            outline: 'none',
            color: '#1e293b'
          }}
        />

        <button 
          type="submit" 
          style={{ 
            padding: '0.85rem 1.5rem', 
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
            color: '#fff', 
            fontWeight: '700', 
            fontSize: '0.9rem', 
            borderRadius: '1rem', 
            border: 'none', 
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
          }}
        >
          + เพิ่มปุ่มลัด
        </button>
      </form>

      <div className="category-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', paddingTop: '1.25rem' }}>
        {quickAmounts.length === 0 ? (
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>ไม่มีข้อมูลปุ่มลัด</span>
        ) : (
          quickAmounts.map((item) => (
            <span 
              key={item.id}
              className="quick-item"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                backgroundColor: '#e0e7ff', 
                color: '#3730a3', 
                padding: '0.45rem 0.95rem', 
                borderRadius: '9999px', 
                fontSize: '0.85rem', 
                fontWeight: '700',
                border: '1px solid #c7d2fe'
              }}
            >
              <span>+{item.amount}</span>
              <button 
                type="button" 
                onClick={() => onDeleteClick(item.id)} 
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontWeight: '800',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}
                title="ลบ"
              >
                ✕
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// Main Component: AdminDashboard
// ==========================================
export default function AdminDashboard({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quickAmounts, setQuickAmounts] = useState([]);
  const [newCat, setNewCat] = useState({ name: '', type: 'expense', icon: '📦' });

  // State สำหรับควบคุม Modal ยืนยันการลบ / ออกจากระบบ
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'ตกลง',
    type: 'warning',
    onConfirm: () => {}
  });

  // State สำหรับควบคุม Modal แจ้งเตือนสั้นๆ ( Success / Alert )
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success'
  });

  const triggerAlert = (title, description, type = 'success') => {
    setAlertModal({ isOpen: true, title, description, type });
  };

  // Fetch Data
  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get_transactions.php?t=${Date.now()}`);
      if (res.ok) setTransactions(await res.json() || []);
    } catch (err) { console.error("Fetch error:", err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get_categories.php?t=${Date.now()}`);
      if (res.ok) setCategories(await res.json() || []);
    } catch (err) { console.error("Fetch error:", err); }
  };

  const fetchQuickAmounts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get_quick_amounts.php?t=${Date.now()}`);
      if (res.ok) setQuickAmounts(await res.json() || []);
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchQuickAmounts();
  }, []);

  // Summary Calculations
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const netBalance = totalIncome - totalExpense;

  // Handler: Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) {
      return triggerAlert('กรอกข้อมูลไม่ครบ', 'กรุณาระบุชื่อหมวดหมู่ที่ต้องการเพิ่ม', 'warning');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/add_category.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
      const data = await res.json();
      if (data.status === 'success') {
        const addedName = newCat.name;
        setNewCat({ name: '', type: 'expense', icon: '📦' });
        fetchCategories();
        triggerAlert('เพิ่มสำเร็จ!', `เพิ่มหมวดหมู่ "${addedName}" เข้าสู่ระบบแล้ว`, 'success');
      } else {
        triggerAlert('เกิดข้อผิดพลาด', data.message || "ไม่สามารถเพิ่มหมวดหมู่ได้", 'error');
      }
    } catch (err) {
      console.error("Add category error:", err);
      triggerAlert('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error');
    }
  };

  // Handler: Delete Category Confirmation
  const handleDeleteCategoryClick = (cat) => {
    setConfirmModal({
      isOpen: true,
      title: `ลบหมวดหมู่ "${cat.name}"?`,
      description: 'รายการหมวดหมู่นี้จะถูกลบออกจากระบบอย่างถาวร',
      confirmText: 'ลบหมวดหมู่',
      type: 'warning',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_BASE_URL}/delete_category.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: cat.id })
          });
          const data = await res.json();
          if (data.status === 'success') {
            fetchCategories();
            triggerAlert('ลบสำเร็จ', `ลบหมวดหมู่ "${cat.name}" เรียบร้อยแล้ว`, 'success');
          } else {
            triggerAlert('ไม่สามารถลบได้', data.message || "เกิดข้อผิดพลาดในการลบหมวดหมู่", 'error');
          }
        } catch (err) {
          triggerAlert('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error');
        }
      }
    });
  };

  // Handler: Delete Quick Amount Confirmation
  const handleDeleteQuickAmountClick = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'ลบปุ่มลัดจำนวนเงิน?',
      description: 'ปุ่มลัดนี้จะถูกลบออกจากระบบ',
      confirmText: 'ลบ',
      type: 'warning',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await fetch(`${API_BASE_URL}/delete_quick_amount.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });
          const data = await res.json();
          if (data.status === 'success') {
            fetchQuickAmounts();
            triggerAlert('ลบสำเร็จ', 'ลบปุ่มลัดจำนวนเงินเรียบร้อยแล้ว', 'success');
          } else {
            triggerAlert('ไม่สามารถลบได้', data.message || "เกิดข้อผิดพลาดในการลบปุ่มลัด", 'error');
          }
        } catch (err) {
          triggerAlert('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error');
        }
      }
    });
  };

  // Handler: Logout Confirmation
  const handleLogoutClick = () => {
    setConfirmModal({
      isOpen: true,
      title: 'ออกจากระบบ?',
      description: 'คุณต้องการออกจากระบบผู้ดูแลระบบใช่หรือไม่',
      confirmText: 'ออกจากระบบ',
      type: 'warning',
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        if (onLogout) onLogout();
      }
    });
  };

  return (
    <div className="admin-page" style={{ backgroundColor: '#f4f7fb', minHeight: '100vh', padding: '1.5rem 1rem 2.5rem' }}>
      <ModalStyles />
      
      {/* Confirmation Modal */}
      <ActionModal 
        isOpen={confirmModal.isOpen} 
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
        showCancel={true}
      />

      {/* Alert / Success Modal */}
      <ActionModal 
        isOpen={alertModal.isOpen} 
        onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))} 
        title={alertModal.title}
        description={alertModal.description}
        confirmText="ตกลง"
        type={alertModal.type}
        showCancel={false}
      />

      <div className="admin-container">
        
        {/* Header Panel */}
        <div className="admin-header"
          style={{ 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
            color: '#ffffff', 
            borderRadius: '2rem', 
            padding: '2.25rem 2.5rem',
            boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <div>
            <span 
              style={{ 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                color: '#ffffff', 
                fontSize: '0.725rem', 
                fontWeight: '800', 
                padding: '0.3rem 0.85rem', 
                borderRadius: '9999px',
                display: 'inline-block',
                marginBottom: '0.75rem',
                letterSpacing: '0.08em',
                boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
              }}
            >
              ADMIN DASHBOARD
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              แผงควบคุมผู้ดูแลระบบ
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0.35rem 0 0 0' }}>
              ยินดีต้อนรับกลับ, <span style={{ color: '#fbbf24', fontWeight: '700' }}>{user?.username || 'weerasan'}</span>
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleLogoutClick}
            style={{
              background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.9rem',
              padding: '0.85rem 1.65rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 20px -4px rgba(244, 63, 94, 0.4)',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Icons.Logout />
            ออกจากระบบ
          </button>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats">
          
          <div className="admin-stat-card" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>รายรับทั้งหมด</p>
              <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#10b981', margin: '0.35rem 0 0 0', letterSpacing: '-0.02em' }}>
                +฿{totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div style={{ width: '3rem', height: '3rem', backgroundColor: '#ecfdf5', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.TrendUp />
            </div>
          </div>

          <div className="admin-stat-card" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>รายจ่ายทั้งหมด</p>
              <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#f43f5e', margin: '0.35rem 0 0 0', letterSpacing: '-0.02em' }}>
                -฿{totalExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div style={{ width: '3rem', height: '3rem', backgroundColor: '#fff1f2', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.TrendDown />
            </div>
          </div>

          <div className="admin-stat-card" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>คงเหลือสุทธิ</p>
              <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: netBalance >= 0 ? '#4f46e5' : '#f43f5e', margin: '0.35rem 0 0 0', letterSpacing: '-0.02em' }}>
                ฿{netBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div style={{ width: '3rem', height: '3rem', backgroundColor: '#eef2ff', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.Wallet />
            </div>
          </div>
        </div>

        {/* Management Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1rem' }}>
          
          {/* Category Management */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.75rem',
            borderRadius: '1.5rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)'
          }}>
            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #f8fafc', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ backgroundColor: '#e0f2fe', padding: '0.35rem 0.6rem', borderRadius: '0.75rem', fontSize: '1.1rem' }}>📁</span>
                จัดการหมวดหมู่
              </h2>
            </div>

            <form className="category-form" onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                value={newCat.type}
                onChange={(e) => setNewCat({ ...newCat, type: e.target.value })}
                style={{
                  padding: '0.85rem 1rem',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '1rem',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  color: '#334155'
                }}
              >
                <option value="expense">รายจ่าย (-)</option>
                <option value="income">รายรับ (+)</option>
              </select>

              <input
                type="text"
                placeholder="📦"
                value={newCat.icon}
                onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
                style={{
                  width: '65px',
                  padding: '0.85rem',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '1rem',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />

              <input
                type="text"
                placeholder="ชื่อหมวดหมู่ใหม่..."
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                style={{
                  flex: 1,
                  minWidth: '180px',
                  padding: '0.85rem 1.25rem',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '1rem',
                  fontSize: '0.875rem',
                  backgroundColor: '#f8fafc',
                  outline: 'none'
                }}
              />

              <button 
                type="submit" 
                style={{ 
                  padding: '0.85rem 1.65rem', 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: '#fff', 
                  fontWeight: '700', 
                  fontSize: '0.875rem', 
                  borderRadius: '1rem', 
                  border: 'none', 
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                + เพิ่มหมวดหมู่
              </button>
            </form>

            <div className="quick-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', paddingTop: '1.25rem' }}>
              {categories.length === 0 ? (
                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>ไม่มีข้อมูลหมวดหมู่</span>
              ) : (
                categories.map((cat) => (
                  <span 
                    key={cat.id}
                    className="category-item"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      backgroundColor: cat.type === 'income' ? '#d1fae5' : '#f1f5f9', 
                      color: cat.type === 'income' ? '#065f46' : '#334155', 
                      padding: '0.45rem 0.95rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.825rem', 
                      fontWeight: '700',
                      border: cat.type === 'income' ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
                    }}
                  >
                    <span>{cat.icon} {cat.name}</span>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteCategoryClick(cat)} 
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        border: 'none', 
                        color: '#ef4444', 
                        cursor: 'pointer', 
                        fontWeight: '800', 
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem'   
                      }}
                      title="ลบหมวดหมู่"
                    >
                      ✕
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Quick Amount Management */}
          <AdminQuickAmountManager 
            quickAmounts={quickAmounts} 
            onRefresh={fetchQuickAmounts}
            onDeleteClick={handleDeleteQuickAmountClick}
            showAlert={triggerAlert}
          />

        </div>
      </div>
    </div>
  );
}