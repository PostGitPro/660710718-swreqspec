# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from tests.conftest import AUTH


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_TC_BKG_01_3_missing_identity_verification(client, make_slot):
    # Given: ยังไม่ได้ยืนยันตัวตน และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id})

    # Then: ต้องได้รับผลยืนยันตัวตนจากระบบยืนยันตัวตนก่อนเข้าถึงข้อมูลผู้รับบริการ
    assert res.status_code != 201
    # Then: ผลการตอบกลับเมื่อไม่ผ่าน spec ไม่ได้บอก
