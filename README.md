# 🚂 ProjectWebApp — ระบบจองตั๋วรถไฟออนไลน์

ระบบจองตั๋วรถไฟออนไลน์ของการรถไฟแห่งประเทศไทย (SRT) พัฒนาในรายวิชา Web Application โดยนักศึกษามหาวิทยาลัยศิลปากร

## ✨ ฟีเจอร์หลัก

- **สมัครสมาชิก / เข้าสู่ระบบ** — ระบบ authentication ผ่าน localStorage
- **จองตั๋วรถไฟ** — เลือกเส้นทาง (สายเหนือ, สายใต้, สายตะวันออก, สายตะวันออกเฉียงเหนือ), วันเวลา, คลาส, จำนวนผู้โดยสาร
- **ชำระเงินผ่าน QR Code** — แสดง QR Code เพื่อชำระเงิน
- **ประวัติการสั่งซื้อ** — ดูรายการจองทั้งหมด
- **ยกเลิกตั๋ว** — ยกเลิกตั๋วด้วยรหัสจอง
- **รองรับ 2 ภาษา** — ไทย / English

## 📁 โครงสร้างโปรเจกต์

```
ProjectWebApp/
├── index1.html            # หน้าหลัก (จองตั๋ว)
├── login.html             # เข้าสู่ระบบ
├── register.html          # สมัครสมาชิก
├── Booking_Popup.html     # Popup ยืนยันการจอง
├── order_history.html     # ประวัติการสั่งซื้อ
├── cancel_ticket.html     # ยกเลิกตั๋ว
├── css/
│   ├── styles1.css        # สไตล์หลัก
│   ├── order_history.css  # สไตล์หน้าประวัติ
│   └── test.css           # สไตล์หน้ายกเลิกตั๋ว
├── js/
│   ├── script.js          # ลอจิกหลัก (เส้นทาง, ราคา, popup, แปลภาษา)
│   ├── login.js           # ลอจิก login
│   ├── register.js        # ลอจิก register
│   ├── history_order.js   # ลอจิกแสดงประวัติ
│   ├── cancel.js          # ลอจิกยกเลิกตั๋ว
│   └── web.js             # utility ทั่วไป
└── images/
    ├── hero-bg.jpg        # ภาพพื้นหลัง
    ├── logo1.png          # โลโก้ header
    ├── logo2.png          # โลโก้ hero section
    └── app-store-badges.png  # ปุ่ม App Store / Google Play
```

## 🛠️ เทคโนโลยี

| เทคโนโลยี | รายละเอียด |
|-----------|-----------|
| HTML5 | โครงสร้างหน้าเว็บ |
| CSS3 | ตกแต่งและ responsive |
| JavaScript (Vanilla) | ลอจิกฝั่ง client |
| localStorage | เก็บข้อมูลผู้ใช้และการจอง |
| Font Awesome 6 | ไอคอน |

## 🚀 วิธีใช้งาน

1. Clone repository:
   ```bash
   git clone https://github.com/660710095/ProjectWebApp.git
   ```
2. เปิดไฟล์ `ProjectWebApp/index1.html` ในเบราว์เซอร์

ไม่ต้องติดตั้ง dependency ใดๆ — เป็น static site ทั้งหมด

## 👥 ผู้พัฒนา

- **Manorin** (Nanthani) — มหาวิทยาลัยศิลปากร (Silpakorn University)

## 📄 License

ยังไม่ได้กำหนด
