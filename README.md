# 🚂 SRT Ticket Booking System — Fullstack Web Application

ระบบจองตั๋วรถไฟออนไลน์ การรถไฟแห่งประเทศไทย (State Railway of Thailand)  
สถาปัตยกรรม **Fullstack Web Application (Node.js REST API + Responsive Frontend)**

---

## ✨ คุณสมบัติหลัก (Features)

- **🔐 ระบบสมาชิกและการยืนยันตัวตน (Authentication & Auth API)**:
  - สมัครสมาชิกใหม่ (`POST /api/auth/register`)
  - เข้าสู่ระบบ (`POST /api/auth/login`)
  - รองรับทั้งการเชื่อมต่อผ่าน Backend API และ Fallback สู่ Offline `localStorage`
- **🎫 ระบบค้นหาและจองตั๋วโดยสาร (Ticket Reservation)**:
  - กรองเส้นทาง 4 ภาค (สายเหนือ, ตะวันออกเฉียงเหนือ, ตะวันออก, สายใต้)
  - คำนวณราคาอัตโนมัติตามระยะทางและชั้นโดยสาร (Economy / First Class)
  - ออกรหัสตั๋วอัตโนมัติ (Booking Reference Number เช่น `SRT88921`)
- **📲 ชำระเงินผ่าน Dynamic QR Code**:
  - สร้าง QR Code พร้อมรายละเอียดตั๋วและยอดเงินแบบ Real-time
- **📜 ประวัติการสั่งซื้อ (Order History & Management)**:
  - ดึงข้อมูลจากฐานข้อมูลกลาง (`GET /api/bookings`)
  - แสดงสถานะตั๋วและรายละเอียดครบถ้วน
- **❌ ระบบยกเลิกตั๋วโดยสาร (Ticket Cancellation)**:
  - ค้นหาและยกเลิกตั๋วด้วยรหัสจองผ่าน API (`POST /api/bookings/cancel`)
- **🌐 รองรับ 2 ภาษา (Bilingual Support)**:
  - สลับภาษาไทย (TH) และอังกฤษ (EN) ได้ทันที

---

## 🏗️ โครงสร้างสถาปัตยกรรม (Fullstack Architecture)

```
ProjectWebApp/
├── package.json           # สคริปต์รันและ metadata ของโปรเจกต์
├── server.js              # Node.js Backend Server (REST API + Static Server)
├── data/
│   └── db.json            # ฐานข้อมูล JSON สำหรับ Users และ Bookings
├── public/                # Frontend Assets (Client Side)
│   ├── index.html         # หน้าแรกและระบบจองตั๋ว (Landing & Booking Form)
│   ├── index1.html        # Alias รองรับ URL เดิม
│   ├── login.html         # หน้าเข้าสู่ระบบ (Executive UI)
│   ├── register.html      # หน้าสมัครสมาชิก (Executive UI)
│   ├── order_history.html # หน้าประวัติการสั่งซื้อ
│   ├── cancel_ticket.html # หน้ายกเลิกตั๋ว
│   ├── css/
│   │   ├── styles1.css       # ธีมหลัก (SRT Crimson & Deep Navy)
│   │   ├── order_history.css # ตารางประวัติการจอง
│   │   └── test.css          # ฟอร์มยกเลิกตั๋ว
│   ├── js/
│   │   ├── api.js            # Universal API Client (Online API + Offline Fallback)
│   │   ├── script.js         # ลอจิกการคำนวณราคา, เส้นทาง, QR Code
│   │   ├── login.js          # จัดการสถานะผู้ใช้บน Topbar
│   │   ├── register.js       # จัดการสมัครสมาชิก
│   │   ├── history_order.js  # ดึงข้อมูลประวัติการจองมาแสดงผล
│   │   └── cancel.js         # ลอจิกยกเลิกตั๋ว
│   └── images/
│       ├── hero-bg.jpg       # ภาพพื้นหลังขบวนรถไฟ
│       ├── logo1.png         # โลโก้การรถไฟฯ ส่วน Header
│       ├── logo2.png         # โลโก้ส่วน Hero
│       └── app-store-badges.png
├── .gitignore
└── README.md
```

---

## 📡 REST API Documentation

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| `GET` | `/api/health` | ตรวจสอบสถานะ Server และ API Service |
| `POST` | `/api/auth/register` | ลงทะเบียนผู้ใช้ใหม่ `{ username, email, password }` |
| `POST` | `/api/auth/login` | เข้าสู่ระบบ `{ email, password }` |
| `GET` | `/api/bookings` | รายการตั๋วโดยสารทั้งหมดจากฐานข้อมูล |
| `POST` | `/api/bookings` | บันทึกการจองตั๋วใหม่ |
| `POST` | `/api/bookings/cancel` | ยกเลิกตั๋วโดยสารด้วยรหัส `{ code }` |

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. โคลนโปรเจกต์
```bash
git clone https://github.com/660710095/ProjectWebApp.git
cd ProjectWebApp
```

### 2. รันเซิร์ฟเวอร์แบบ Fullstack
โปรเจกต์ใช้ Node.js Standard Library (`node:http`, `node:fs`) **ไม่ต้องรัน `npm install` เพิ่มเติม**!

```bash
npm start
```
หรือ:
```bash
node server.js
```

เปิดเบราว์เซอร์ไปที่:
👉 **[http://localhost:3000](http://localhost:3000)**

*(หรือสามารถดับเบิลคลิกเปิดไฟล์ `public/index.html` แบบ Offline ก็ยังใช้งานได้ด้วยระบบ Auto-fallback)*
