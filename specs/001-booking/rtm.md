# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md  
สร้างด้วย /verify เมื่อ 2569-10-07 | test: 5 ผ่าน 0 ไม่ผ่าน (backend), 1 ผ่าน 0 ไม่ผ่าน (frontend)

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 | T-02 เสร็จ | `backend/app/slots/service.py:list_available_slots`, `backend/app/slots/router.py:get_slots` | `test_AC_BKG_05` ผ่าน แต่ตรวจเพียง status/p95 ไม่ตรวจช่วง 30 วันและจำนวนที่นั่งครบ | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 พร้อมทำ | ยังไม่มีโค้ดกันจองซ้ำ | ไม่มี | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 พร้อมทำ | ยังไม่มีโค้ดเสนอช่วงใกล้เคียงหรือหน้าจอยืนยัน | ไม่มี | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03 เสร็จ, T-06 รอ Q-02 | `backend/app/booking/service.py:create_booking`, `backend/app/booking/router.py:create_booking` | `test_AC_BKG_01`, `test_TC_BKG_01_3_missing_identity_verification` ผ่าน; แถว `TC-BKG-01-1` และ `TC-BKG-01-2` สถานะใช้ได้แต่ยังไม่มี test | ช่องโหว่ |
| FR-BKG-05 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มีคิวแจ้งเตือนหรือส่งซ้ำ | ไม่มี | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-02 เสร็จ, T-10 พร้อมทำ | `backend/app/slots/service.py:list_available_slots` กรอง `package_code`; ยังไม่มีหน้าจอเปลี่ยนแพ็กเกจ | ไม่มี | ช่องโหว่ |
| NFR-PERF-01 | AC-BKG-05 | T-02 เสร็จ | `backend/app/slots/router.py:get_slots` | `test_AC_BKG_05` ผ่าน แต่เรียก 200 ครั้งแบบลำดับ ไม่ใช่ผู้ใช้พร้อมกัน 200 คน | ช่องโหว่ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มีการตั้งค่า TLS ในโค้ดหรือ deployment | ไม่มี | ช่องโหว่ |
| NFR-REL-02 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มีระบบ retry | ไม่มี | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task ตรวจ usability | ไม่มีหน้าจอ workflow สำหรับทดสอบผู้ใช้ใหม่ | ไม่มี | ช่องโหว่ |
| CON-TECH-01 | ไม่มี AC ตรง ๆ | T-01 เสร็จ | `backend/app/config.py:DATABASE_URL`, `backend/app/db/session.py:engine` รองรับ PostgreSQL เมื่อกำหนด env แต่ default เป็น SQLite | `test_T01_tables_created`, `test_T01_no_national_id` ผ่านบน SQLite | ช่องโหว่ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 พร้อมทำ | ยังไม่มี audit middleware หรือการบันทึก audit log | ไม่มี | ยังไม่ถึง |
| IF-IDP-01 | AC-BKG-01 | T-03 เสร็จ | `backend/app/auth/idp.py:get_verified_hn` เป็น dependency ของ booking endpoint | `test_TC_BKG_01_3_missing_identity_verification` ผ่าน แต่ assert เพียงไม่ใช่ 201 | ช่องโหว่ |
| IF-HIS-01 | ไม่มี AC ตรง ๆ | T-09 พร้อมทำ | ยังไม่มี HIS lookup; model ไม่มี `national_id` | `test_T01_no_national_id` ผ่าน แต่ยังไม่มี test การ lookup/ไม่เก็บข้อมูลจริง | ยังไม่ถึง |
| IF-NOT-01 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มี notify queue | ไม่มี | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/config.py:DATABASE_URL` | CON-TECH-01 | ไม่ตรงทั้งหมด | ค่าเริ่มต้นเป็น SQLite ขณะที่ spec บังคับ PostgreSQL |
| `backend/app/main.py:lifespan`, `app` | CON-TECH-01 | ยังไม่ครบ | สร้างตารางตรง ๆ และไม่มี audit/notify/HIS integration |
| `backend/app/auth/idp.py:get_verified_hn` | IF-IDP-01 | ตรงบางส่วน | ตรวจ token ก่อนเข้าถึง booking ได้ แต่เป็น mock prefix และยังไม่มีการตรวจระบบ IDP จริง |
| `backend/app/slots/router.py:get_slots` | FR-BKG-01, FR-BKG-06 | ไม่ตรง FR-BKG-01 ทั้งหมด | คืน slot และ remaining ได้ แต่ช่วงค้นหาถูกจำกัด 14 วันใน service |
| `backend/app/slots/service.py:list_available_slots` | FR-BKG-01, FR-BKG-06 | ไม่ตรงทั้งหมด | `DAYS_AHEAD = 14` ไม่ใช่ 30 และยังไม่มี UI เปลี่ยน package |
| `backend/app/booking/router.py:create_booking` | FR-BKG-04, IF-IDP-01, IF-HIS-01 | ไม่ตรง | รับ `national_id` และเขียนลง log ทั้งที่ constraint ระบุไม่ให้เก็บเลขบัตรประชาชน |
| `backend/app/booking/service.py:create_booking` | FR-BKG-04 | ไม่ตรง | เงื่อนไขเต็มใช้ `remaining < 0` ทำให้ slot ที่เหลือ 0 ยังถูกจองได้ |
| `backend/app/booking/service.py:next_queue_no` | FR-BKG-04, Q-02 | ไม่ตรง/เดา Q-02 | กำหนดรูปแบบ `A001` และ reset รายวันทั้งที่ Q-02 ยังไม่มีคำตอบ |
| `backend/app/booking/router.py:cancel_booking`, `service.py:cancel_booking` | UC-02 | ไม่ตรงและอยู่ใน Out of scope | เพิ่ม DELETE ยกเลิกและคืนที่นั่ง ทั้งที่ spec ระบุยกเลิก/เลื่อนคิวนอก scope |
| `frontend/src/api/client.js:api.getSlots`, `api.createBooking` | FR-BKG-01, FR-BKG-03, FR-BKG-04 | ยังไม่ครบ | มี client แต่ไม่มีหน้าจอที่เรียกใช้ |
| `frontend/src/App.jsx:App` | FR-BKG-01 ถึง FR-BKG-05 | ยังไม่ตรง | เป็นเพียงโครงหน้า ไม่มี workflow จองหรือแสดงผล booking |
| `backend/app/db/models.py:Slot`, `Booking`, `AuditLog` | CON-TECH-01, DOM-PDPA-01, IF-HIS-01 | บางส่วน | มี schema พื้นฐานและไม่มี `national_id` ใน bookings แต่ audit log ไม่ถูกใช้งานจริง |
| `backend/app/db/migrations/001_init.py:upgrade` | CON-TECH-01, DOM-PDPA-01 | บางส่วน | สร้างตารางได้ แต่ไม่ได้บังคับ PostgreSQL และไม่มี retention 1 ปี |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง  
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | ตัวเลขไม่ตรง spec | `backend/app/slots/service.py:DAYS_AHEAD` | FR-BKG-01 | ใช้ 14 วันแทน 30 วัน | |
| F-002 | test อ่อน / AC ไม่มี test | `backend/tests/test_AC_BKG_01.py`, `test-cases.md` | AC-BKG-01, FR-BKG-04 | test เดิม assert เพียง status 201; TC-BKG-01-1 และ TC-BKG-01-2 ที่ใช้ได้ยังไม่มี test ในโค้ด | |
| F-003 | โค้ดไม่มี FR | `backend/app/booking/service.py:create_booking` | FR-BKG-03 | ไม่ตรวจ slot ที่ remaining เท่ากับ 0 และไม่มีข้อเสนอ 3 ช่วงใกล้เคียง | |
| F-004 | FR ไม่มี AC | `spec.md`, `test-cases.md` | FR-BKG-06 | ไม่มี AC ที่ตรวจการคำนวณช่วงว่างใหม่เมื่อเปลี่ยนแพ็กเกจ | |
| F-005 | test อ่อน | `backend/tests/test_AC_BKG_05.py` | NFR-PERF-01 | ทดสอบ 200 request แบบต่อเนื่อง ไม่ใช่ผู้ใช้พร้อมกัน 200 คนตาม requirement | |
| F-006 | ช่องโหว่ | ไม่มี TLS configuration | NFR-SEC-01 | ไม่พบการบังคับ TLS 1.2 ขึ้นไป | |
| F-007 | ช่องโหว่ | `spec.md`, `tasks.md` | NFR-USE-01 | ไม่มี AC/task/test สำหรับเกณฑ์ผู้ใช้ใหม่ 8 ใน 10 คนภายใน 3 นาที | |
| F-008 | ละเมิด Constraint | `backend/app/booking/router.py:BookingRequest`, logger | IF-HIS-01 | รับ `national_id` และเขียนค่าเลขบัตรประชาชนลง log แม้ spec ห้ามเก็บและให้ใช้ HN ภายในระบบ | |
| F-009 | เดา Q-xx | `backend/app/booking/service.py:next_queue_no` | Q-02, FR-BKG-04 | กำหนดรูปแบบ `A001` และการ reset รายวันก่อนทีมตอบ Q-02 | |
| F-010 | โค้ดไม่มี FR / อยู่ใน Out of scope | `backend/app/booking/router.py:DELETE /bookings/{booking_id}` | UC-02 | เพิ่มฟังก์ชันยกเลิก/คืนที่นั่ง ทั้งที่ cancellation อยู่ใน Out of scope | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
