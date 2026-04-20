# คู่มือการติดตั้งและใช้งานระบบ (Step-by-Step Deployment Guide)

คู่มือนี้จะช่วยให้คุณนำระบบ ERP/Production Tracking นี้ไปใช้งานจริง โดยใช้ **GitHub** สำหรับเก็บโค้ด, **Vercel** สำหรับการ Deploy และ **Google Sheets** เป็นฐานข้อมูล

---

## 🟢 ขั้นตอนที่ 1: เตรียมฐานข้อมูล (Google Sheets & Apps Script)

ระบบนี้ใช้ Google Sheets เป็นฐานข้อมูลหลัก เพื่อให้คุณจัดการข้อมูลได้ง่ายเหมือนใช้ Excel

1. **สร้าง Google Sheet ใหม่**:
   - สร้างไฟล์ Google Sheet ใหม่ใน Google Drive ของคุณ
   - สร้าง Sheet ย่อย (Tabs) ตามชื่อดังนี้:
     - `JobOrders`
     - `WarehouseIn`
     - `WarehouseOut`
     - `MasterCodes`
     - `ItemMaster`
     - `ProductionLogs`
   - *หมายเหตุ: ใส่หัวตาราง (Header) ให้ตรงตามที่ระบุในไฟล์ `firebase-blueprint.json` หรือตามระบบที่ต้องการ*

2. **ติดตั้ง Apps Script (Backend API)**:
   - ที่หน้า Google Sheet ไปที่เมนู **Extensions** > **Apps Script**
   - คัดลอกโค้ดจากไฟล์ `backend/Code.gs` ในโปรเจกต์นี้ไปวางแทนที่โค้ดเดิมใน Apps Script
   - กดปุ่ม **Save** (รูปแผ่นดิสก์) และตั้งชื่อโปรเจกต์ว่า `ERP_Backend_API`
   - **การตั้งค่าหัวตารางอัตโนมัติ**:
     - ที่แถบเมนูด้านบนของ Apps Script เลือกฟังก์ชัน `setupDatabase` จากรายการดรอปดาวน์
     - กดปุ่ม **Run**
     - ระบบจะสร้าง Sheet ทั้งหมดและตั้งค่าหัวตาราง (Headers) ให้คุณโดยอัตโนมัติ พร้อมสร้าง User ตัวอย่างให้ด้วย

3. **Deploy Apps Script**:
   - กดปุ่ม **Deploy** (มุมขวาบน) > **New Deployment**
   - เลือกประเภทเป็น **Web App**
   - ตั้งค่าดังนี้:
     - **Description**: `Production API v1`
     - **Execute as**: `Me` (อีเมลของคุณ)
     - **Who has access**: `Anyone` (เพื่อให้ระบบจาก Vercel เชื่อมต่อได้)
   - กดปุ่ม **Deploy**
   - **สำคัญ**: คัดลอก **Web App URL** ที่ได้ (เช่น `https://script.google.com/macros/s/.../exec`) เก็บไว้

---

## 🔵 ขั้นตอนที่ 2: จัดเก็บโค้ดใน GitHub

1. **สร้าง Repository ใหม่ใน GitHub**:
   - ไปที่ [github.com](https://github.com) และสร้าง Repository ใหม่ (ตั้งชื่อตามต้องการ เช่น `my-erp-system`)
   - ตั้งค่าเป็น `Private` (แนะนำ) หรือ `Public`

2. **Push โค้ดขึ้น GitHub**:
   - หากคุณใช้งานผ่าน AI Studio ให้ใช้เมนู **Export to GitHub**
   - หรือหากใช้ Git command line:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin https://github.com/USER/REPOSITORY.git
     git push -u origin main
     ```

---

## 🟡 ขั้นตอนที่ 3: Deploy ผ่าน Vercel.com

Vercel จะทำหน้าที่ host เว็บไซต์ของคุณและคอยอัปเดตอัตโนมัติเมื่อมีการเปลี่ยนแปลงโค้ด

1. **เชื่อมต่อ GitHub กับ Vercel**:
   - ไปที่ [vercel.com](https://vercel.com) และเข้าสู่ระบบด้วยบัญชี GitHub ของคุณ
   - กดปุ่ม **Add New** > **Project**
   - ค้นหา Repository ที่คุณสร้างไว้ในขั้นตอนที่ 2 และกด **Import**

2. **ตั้งค่า Environment Variables (สำคัญมาก)**:
   - ในหน้าการตั้งค่าก่อน Deploy (Configure Project) ให้หาเมนู **Environment Variables**
   - เพิ่มตัวแปรดังนี้:
     - **Key**: `VITE_APPS_SCRIPT_URL`
     - **Value**: (วาง Web App URL ที่คุณคัดลอกมาจากขั้นตอนที่ 1)
   - *หากมีการใช้งาน Gemini AI ให้เพิ่ม:*
     - **Key**: `GEMINI_API_KEY`
     - **Value**: (API Key ของคุณจาก AI Studio)

3. **กด Deploy**:
   - เมื่อตั้งค่าเสร็จแล้ว กดปุ่ม **Deploy**
   - รอประมาณ 1-2 นาที คุณจะได้ URL สำหรับเข้าใช้งานระบบ (เช่น `https://my-erp-system.vercel.app`)

---

## 🔴 ขั้นตอนที่ 4: การรักษาความเสถียร (Best Practices)

เพื่อให้ระบบทำงานได้จริง ไม่ lag และรองรับผู้ใช้หลายคน:

- **Lock Service**: ระบบมีระบบ `LockService` ใน `Code.gs` เพื่อป้องกันข้อมูลตีกัน (Collision) เมื่อมีการเขียนข้อมูลพร้อมกัน
- **Retry Mechanism**: ฝั่ง Frontend (React) มีระบบยิงซ้ำ (Retry) อัตโนมัติหาก Backend ไม่ตอบสนองชั่วคราว
- **Cache**: ข้อมูล Master Data จะถูกเก็บไว้ใน Cache ชั่วคราวบน Browser เพื่อให้เปิดเมนูต่างๆ ได้รวดเร็ว
- **GitHub Sync**: ทุกครั้งที่คุณ Push โค้ดใหม่ขึ้น GitHub, Vercel จะ Deploy ให้คุณใหม่ทันทีโดยไม่ต้องตั้งค่าซ้ำ

---

## 📖 สรุปขั้นตอนการดูแลรักษา
1. **เพิ่มฟีเจอร์**: แก้ไขโค้ดใน GitHub > Vercel อัปเดตให้ทันที
2. **แก้ไขฐานข้อมูล**: แก้ไขใน Google Sheets ได้โดยตรง
3. **ตรวจสอบ Error**: ดู Logs ได้ที่หน้า Apps Script Dashboard หรือ Vercel Runtime Logs

หากมีข้อสงสัยเพิ่มเติม สามารถตรวจสอบไฟล์ `AGENTS.md` สำหรับมาตรฐานการเขียนโค้ดของระบบนี้
