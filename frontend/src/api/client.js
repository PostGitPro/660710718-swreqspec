// จุดเดียวที่หน้าจอใช้เรียก API หลังบ้าน (ตามสัญญา API ใน plan.md ข้อ 4)
// ตอน test ให้ส่ง client จำลองเข้าไปในหน้าจอแทน ไม่ต้องรันหลังบ้านจริง
// เรียกผ่าน /api (ดู proxy ใน vite.config.js) หลังบ้านต้องรันอยู่ที่ port 8000
const BASE = import.meta.env.VITE_API_BASE ?? '/api'

const mockSlots = [
  { id: 1, date: '2026-09-24', start_time: '09:00', remaining: 4, package_code: 'PKG-A' },
  { id: 2, date: '2026-09-24', start_time: '10:00', remaining: 2, package_code: 'PKG-A' },
  { id: 3, date: '2026-09-25', start_time: '09:30', remaining: 3, package_code: 'PKG-B' },
  { id: 4, date: '2026-09-26', start_time: '11:00', remaining: 1, package_code: 'PKG-C' },
]

export const api = {
  async getSlots({ dateFrom, packageCode }) {
    try {
      const q = new URLSearchParams({ date_from: dateFrom, package_code: packageCode })
      const res = await fetch(`${BASE}/slots?${q}`)
      if (!res.ok) {
        throw new Error('API unavailable')
      }
      return res.json()
    } catch (error) {
      return mockSlots.filter((slot) => {
        const matchesPackage = packageCode ? slot.package_code === packageCode : true
        return matchesPackage
      })
    }
  },
  async createBooking({ slotId }) {
    const res = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slotId }),
    })
    return { status: res.status, body: await res.json() }
  },
}
