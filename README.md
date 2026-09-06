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
├── docker/
│   └── init.sql             # โครงสร้างตาราง ใช้ตอนรันผ่าน Docker (สร้างฐานข้อมูลอัตโนมัติ)
├── Dockerfile               # build frontend + เตรียม PHP/Apache สำหรับ Docker
├── docker-compose.yml       # สั่งรันเว็บ + MySQL พร้อมกันด้วย docker compose
├── deploy-infinityfree/     # ไฟล์/คู่มือสำหรับอัปโหลดขึ้น InfinityFree
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

## รันด้วย Docker

ถ้าไม่อยากติดตั้ง XAMPP/Node เองบนเครื่อง ใช้ Docker รันทั้งระบบ (frontend + PHP + MySQL) ได้ในคำสั่งเดียว โดยไฟล์ `Dockerfile` จะ build หน้าเว็บให้อัตโนมัติจากซอร์สโค้ด ไม่ต้องรัน `npm install`/`npm run build` เองก่อน

### สิ่งที่ต้องมี

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (มี Docker Compose มาให้ในตัวอยู่แล้ว)

### วิธีรัน

```bash
docker compose up --build
```

รอจน build เสร็จ (รอบแรกจะช้าหน่อยเพราะต้องโหลด image + npm install) แล้วเปิด:

- เว็บแอป: **http://localhost:8080**
- ฐานข้อมูล MySQL (ถ้าอยากต่อด้วยโปรแกรมอื่น เช่น DBeaver/TablePlus): host `localhost` พอร์ต `3307` ผู้ใช้ `expense_user` รหัสผ่าน `expense_pass` ฐานข้อมูล `expense_tracker_db`

ครั้งแรกที่รัน ระบบจะสร้างตาราง `transactions`, `categories`, `quick_amounts` ให้อัตโนมัติจากไฟล์ `docker/init.sql` (สร้างเฉพาะตอนฐานข้อมูลว่างครั้งแรกเท่านั้น)

### คำสั่งที่ใช้บ่อย

```bash
docker compose up --build      # build ใหม่ + รัน (ใช้ตอนแก้โค้ดแล้วอยากลองใหม่)
docker compose up -d           # รันแบบ background โดยไม่ build ใหม่
docker compose down            # ปิดและลบ container (ข้อมูลในฐานข้อมูลยังอยู่)
docker compose down -v         # ปิดและลบข้อมูลฐานข้อมูลทั้งหมดด้วย (เริ่มนับหนึ่งใหม่)
docker compose logs -f web     # ดู log ฝั่งเว็บ/PHP แบบเรียลไทม์
```

### หมายเหตุ

- `api/db.php` ถูกปรับให้อ่านค่าเชื่อมต่อฐานข้อมูลจาก Environment Variable ก่อน (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — ตั้งไว้แล้วใน `docker-compose.yml`) ถ้าไม่มีค่าพวกนี้ (เช่นตอนรันผ่าน XAMPP ปกติ) จะ fallback ไปใช้ค่า `localhost` แบบเดิมให้อัตโนมัติ
- ไฟล์สำหรับอัปโหลดขึ้น InfinityFree (`deploy-infinityfree/db.infinityfree.php`) เป็นคนละไฟล์ ไม่ได้ใช้ Environment Variable เพราะ InfinityFree ไม่รองรับการตั้งค่าตัวแปรแวดล้อมแบบนี้ — ต้องใช้ไฟล์นั้นแทน `api/db.php` เฉพาะตอนแพ็กไฟล์ไปอัปโหลดขึ้น InfinityFree เท่านั้น ดูรายละเอียดที่ `deploy-infinityfree/วิธีขึ้น-host-InfinityFree.md`

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
