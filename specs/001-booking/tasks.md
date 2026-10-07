# Feature: จองคิวตรวจสุขภาพ (Booking)
Spec ID: SPEC-BKG-001
อ้างอิง plan.md: specs/001-booking/plan.md
วันที่: 2026-09-23

สรุป: มี 13 task ทั้งหมด และ 1 task รอ Open Question (Q-02)

### T-01 สร้าง schema และ migration ฐานข้อมูล
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-01
- ไฟล์ที่แตะ: backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/tests/conftest.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง slots, bookings, audit_logs และ test SQLite ในหน่วยความจำพร้อมใช้งาน
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 สร้าง API ค้นหาช่วงว่างและคำนวณที่นั่งคงเหลือ
- รองรับ: FR-BKG-01, FR-BKG-06, NFR-PERF-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: backend/app/slots/router.py, backend/app/slots/service.py, backend/tests/test_AC_BKG_05.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: GET /slots คืนช่วงเวลาว่างภายใน 30 วันพร้อมจำนวนที่นั่งคงเหลือ และ test_AC_BKG_05 วัด p95 ได้ไม่เกิน 2 วินาที
- สถานะ: พร้อมทำ

### T-03 สร้าง API ยืนยันการจองพื้นฐานและบันทึกการจอง
- รองรับ: FR-BKG-04, IF-IDP-01, IF-HIS-01
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: backend/app/booking/router.py, backend/app/booking/service.py, backend/tests/test_AC_BKG_01.py
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: POST /bookings บันทึกการจองได้สำเร็จ ตัดที่นั่ง และ test_AC_BKG_01 ผ่าน
- สถานะ: พร้อมทำ

### T-04 ป้องกันการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02, IF-IDP-01
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/tests/test_AC_BKG_02.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: มีคิวที่ยังไม่ได้ใช้ในวันเดียวกันแล้วพยายามจองใหม่ ระบบปฏิเสธและคืนหมายเลขคิวเดิม และ test_AC_BKG_02 ผ่าน
- สถานะ: พร้อมทำ

### T-05 เสนอช่วงที่ว่างแทนเมื่อเวลาที่เลือกเต็ม
- รองรับ: FR-BKG-03, IF-IDP-01
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: backend/app/slots/service.py, backend/app/booking/service.py, backend/tests/test_AC_BKG_03.py
- ต้องทำหลัง: T-02, T-03
- เสร็จเมื่อ: เมื่อช่วง 09.00 น. เต็ม ระบบคืน 409 พร้อม 3 ช่วงที่ใกล้ที่สุดในวันเดียวกันและวันถัดไป และ test_AC_BKG_03 ผ่าน
- สถานะ: พร้อมทำ

### T-06 จัดการคิวส่งข้อความยืนยันและส่งซ้ำ
- รองรับ: FR-BKG-05, IF-NOT-01, NFR-REL-02, ASM-03
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: backend/app/notify/queue.py, backend/app/booking/service.py, backend/tests/test_AC_BKG_04.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: ส่งข้อความไม่สำเร็จยังคงบันทึกการจอง แสดงหมายเลขคิว และมีงานส่งซ้ำภายใน 5 นาที และ test_AC_BKG_04 ผ่าน
- สถานะ: พร้อมทำ

### T-07 บันทึก audit log ทุกการเข้าถึงข้อมูลการจอง
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: backend/app/audit/middleware.py, backend/app/main.py, backend/tests/test_AC_BKG_06.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: มี audit log ที่ระบุ actor_id, accessed_at และ hn หลังการเปิดดูข้อมูลการจอง และ test_AC_BKG_06 ผ่าน
- สถานะ: พร้อมทำ

### T-08 ตรวจยืนยันตัวตนและค้น HN จาก HIS ก่อนการจอง
- รองรับ: IF-IDP-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-08
- ไฟล์ที่แตะ: backend/app/auth/idp.py, backend/app/his/client.py, backend/app/booking/router.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: การเรียกใช้งาน Booking API ต้องตรวจผลยืนยันตัวตนก่อน และข้อมูลผู้รับบริการค้นจาก HIS ได้ด้วย HN เท่านั้น
- สถานะ: พร้อมทำ

### T-09 สร้างหน้าเลือกแพ็กเกจและช่วงเวลา
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-09
- ไฟล์ที่แตะ: frontend/src/pages/SlotPicker.jsx, frontend/src/api/client.js, frontend/src/App.jsx
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ผู้ใช้เลือกแพ็กเกจและดูช่วงเวลาว่างที่ได้จาก API จำลองพร้อมจำนวนที่นั่งคงเหลือ
- สถานะ: เสร็จ รอทีมตรวจ

### T-10 สร้างหน้้ายืนยันการจองและแสดงเหตุช่วงเวลาเต็มพร้อม 3 ตัวเลือก
- รองรับ: FR-BKG-03, FR-BKG-04
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: frontend/src/pages/ConfirmBooking.jsx, frontend/src/App.jsx, frontend/src/__tests__/AC-BKG-03.test.jsx
- ต้องทำหลัง: T-05, T-09
- เสร็จเมื่อ: หน้ายืนยันแสดงข้อความ "ช่วงเวลาเต็ม" และ 3 ตัวเลือกที่ใกล้ที่สุด พร้อม test หน้าจอ AC-BKG-03.test.jsx ผ่าน
- สถานะ: พร้อมทำ

### T-11 สร้างหน้าแสดงผลการจองและหมายเลขคิว
- รองรับ: FR-BKG-04, FR-BKG-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-11
- ไฟล์ที่แตะ: frontend/src/pages/BookingResult.jsx, frontend/src/App.jsx
- ต้องทำหลัง: T-03, T-06, T-10
- เสร็จเมื่อ: หน้าแสดงผลการจองแสดงหมายเลขคิว และยังคงแสดงได้แม้การส่งข้อความยืนยันไม่สำเร็จ
- สถานะ: พร้อมทำ

### T-12 ต่อหน้าจอกับ API จริงหลังบ้าน
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-12
- ไฟล์ที่แตะ: frontend/src/api/client.js, frontend/src/App.jsx, frontend/src/pages/SlotPicker.jsx, frontend/src/pages/ConfirmBooking.jsx
- ต้องทำหลัง: T-02, T-05, T-10
- เสร็จเมื่อ: หน้าจอเชื่อมต่อกับ API จริงผ่าน /api โดยไม่มีการใช้ mock ที่ขัดกับสัญญา API
- สถานะ: พร้อมทำ

### T-13 ออกเลขคิวตามรูปแบบที่เจ้าหน้าที่เวชระเบียนกำหนด
- รองรับ: FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-13
- ไฟล์ที่แตะ: backend/app/booking/service.py, frontend/src/pages/BookingResult.jsx
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: หมายเลขคิวถูกสร้างตามรูปแบบที่ได้คำตอบจาก Q-02 และแสดงบนหน้าจออย่างถูกต้อง
- สถานะ: รอ Q-02

### ตารางตรวจความครบ AC
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-03 |
| AC-BKG-02 | T-04 |
| AC-BKG-03 | T-05, T-10 |
| AC-BKG-04 | T-06 |
| AC-BKG-05 | T-02 |
| AC-BKG-06 | T-07 |

### ตารางตรวจความครบ Constraint
| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01 |
| DOM-PDPA-01 | T-01, T-07 |
| IF-IDP-01 | T-03, T-04, T-05, T-08 |
| IF-HIS-01 | T-01, T-03, T-08 |
| IF-NOT-01 | T-06 |

### สิ่งที่ยังไม่ทำ
- Q-01 ตอบแล้ว: "ช่วงเวลาใกล้เคียง" รวมวันถัดไป 1 วัน (พยาบาลคัดกรอง 2569-09-16) ย้ายไปอยู่ใน FR-BKG-03
  - task ที่รอ: ไม่มี (task ที่เกี่ยวข้องได้ทำแล้ว)
- Q-02 หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร (เช่น A001)?
  -> ถามเจ้าหน้าที่เวชระเบียน (ยังไม่ได้คำตอบ)
  - task ที่รอ: T-13
