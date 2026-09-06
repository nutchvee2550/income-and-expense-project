# 💰 กระเป๋าเงินของฉัน — ระบบบันทึกรายรับ-รายจ่าย

เว็บแอปสำหรับบันทึกรายรับ-รายจ่ายประจำวัน ดูสรุปตามหมวดหมู่ ตั้งงบประมาณรายวัน และมีหน้าแอดมินไว้จัดการหมวดหมู่/ยอดเงินลัด แยกสิทธิ์การใช้งานเป็นผู้ดูแลระบบ (admin) และผู้ใช้ทั่วไป (user)

## ฟีเจอร์หลัก

- บันทึกรายการรายรับ/รายจ่าย พร้อมหมวดหมู่ จำนวนเงิน และหมายเหตุ
- แก้ไข/ลบรายการ และล้างข้อมูลทั้งหมดได้
- สรุปยอดตามหมวดหมู่ พร้อมกราฟ (Chart.js / Recharts)
- **การ์ดงบประมาณรายวัน** — ตั้งวงเงินที่ใช้ได้ต่อวัน ระบบจะเตือนเมื่อใกล้ครบหรือเกินงบ
- **ปุ่มจำนวนเงินลัด (Quick Amounts)** — กดกรอกจำนวนเงินที่ใช้บ่อยได้เร็วขึ้นโดยไม่ต้องพิมพ์เอง
- **หน้าแอดมิน** — จัดการหมวดหมู่และปุ่มจำนวนเงินลัดของทั้งระบบ
- ระบบ login แยกสิทธิ์ admin / user

## เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | React 19 + Vite, Tailwind CSS, Chart.js / Recharts, SweetAlert2 |
| Backend | PHP (mysqli) — ไฟล์ .php แยกทีละ endpoint ไม่มีเฟรมเวิร์ก |
| ฐานข้อมูล | MySQL |

## โครงสร้างโปรเจกต์

```
Income and Expense Project/
├── src/                     # React source code
│   ├── App.jsx              # จุดเริ่มต้น สลับหน้า Login / User / Admin
│   ├── Login.jsx            # หน้าล็อกอิน
│   ├── ExpenseTracker.jsx   # หน้าใช้งานหลักของ user
│   ├── AdminDashboard.jsx   # หน้าจัดการของ admin
│   ├── DailyBudgetCard.jsx  # การ์ดงบประมาณรายวัน
│   └── ...
├── public/                  # ไฟล์ static (โลโก้ ไอคอน)
├── api/                     # ฝั่งหลังบ้าน (PHP)
│   ├── db.php               # การเชื่อมต่อฐานข้อมูล (ต้องตั้งค่าเอง ดูด้านล่าง)
│   ├── login.php
│   ├── get_transactions.php / add_transaction.php / edit_transaction.php / delete_transaction.php
│   ├── get_categories.php / add_category.php / delete_category.php
│   └── get_quick_amounts.php / add_quick_amount.php / delete_quick_amount.php
└── dist/                    # ไฟล์ที่ได้จากการ build (สร้างเองด้วย npm run build)
```

## เริ่มใช้งานบนเครื่อง (Local / XAMPP)

1. ติดตั้ง [XAMPP](https://www.apachefriends.org/) เปิด Apache และ MySQL
2. วางโปรเจกต์นี้ไว้ใน `C:\xampp\htdocs\`
3. สร้างฐานข้อมูลชื่อ `expense_tracker_db` ผ่าน phpMyAdmin (`http://localhost/phpmyadmin`) แล้วสร้างตาราง `transactions`, `categories`, `quick_amounts` (ดูโครงสร้างคอลัมน์ที่ใช้ได้จากไฟล์ในโฟลเดอร์ `api/`)
4. ติดตั้ง dependencies แล้วรันโหมดพัฒนา:
   ```bash
   npm install
   npm run dev
   ```
5. เปิด `http://localhost:5173` (พอร์ตที่ Vite แจ้งในเทอร์มินัล) — หน้าเว็บจะเรียก API ผ่าน `http://localhost/Income%20and%20Expense%20Project/api` โดยอัตโนมัติเมื่อรันจาก localhost

### บัญชีทดสอบ (ตั้งค่าไว้ใน `api/login.php`)

| Username | Password | สิทธิ์ |
|---|---|---|
| `admin` | `1234` | ผู้ดูแลระบบ |
| `user` | `1234` | ผู้ใช้ทั่วไป |

> ⚠️ เป็นบัญชีทดสอบที่ฝังไว้ในโค้ดตรง ๆ (ไม่ได้เก็บในฐานข้อมูล) เหมาะสำหรับใช้งานส่วนตัว/ทดสอบเท่านั้น ถ้าจะเปิดให้คนนอกเข้าถึงได้กว้างขึ้น ควรเปลี่ยนรหัสผ่านหรือทำระบบสมาชิกจริงก่อน

## Build ขึ้นใช้งานจริง (Production)

```bash
npm run build
```

จะได้โฟลเดอร์ `dist/` ซึ่งเป็นไฟล์หน้าเว็บฉบับพร้อมใช้งาน (static HTML/JS/CSS) เอาไฟล์ในนี้ไปวางไว้ที่รากของเว็บที่จะโฮสต์ (เช่น `htdocs`) พร้อมกับโฟลเดอร์ `api/` (แก้ `api/db.php` ให้ชี้ไปที่ฐานข้อมูลจริงที่จะใช้งาน) — โครงสร้างที่ต้องได้บนเซิร์ฟเวอร์คือ

```
เว็บของคุณ/
├── index.html   (จาก dist/)
├── assets/      (จาก dist/)
└── api/         (คัดลอกจากโปรเจกต์ พร้อมแก้ db.php แล้ว)
```

### โฮสต์ฟรีด้วย InfinityFree

ดูขั้นตอนละเอียดได้ในไฟล์ `deploy-infinityfree/วิธีขึ้น-host-InfinityFree.md` ในโปรเจกต์นี้ (มีไฟล์ `db.infinityfree.php` เทมเพลตและ `schema.sql` แนบไว้ให้ด้วย)

## ข้อควรระวังก่อนเปิดให้ใช้งานจริงจัง

- `api/login.php` เก็บ username/password ไว้ในโค้ดตรง ๆ ไม่มีการเข้ารหัส และทุก endpoint ใน `api/` ไม่มีการตรวจสอบสิทธิ์ฝั่งเซิร์ฟเวอร์ (ใครรู้ URL ก็เรียกได้) — ปลอดภัยพอสำหรับใช้คนเดียว/ในครอบครัว แต่ไม่เหมาะเปิดสู่สาธารณะแบบกว้าง ๆ โดยไม่ปรับปรุงเรื่องสิทธิ์ก่อน
- header `Access-Control-Allow-Origin: *` เปิดกว้างให้ทุกโดเมนเรียก API ได้
- ยังไม่มีระบบสมัครสมาชิก/จัดการผู้ใช้จริง (ใช้บัญชีทดสอบตายตัว 2 บัญชี)
