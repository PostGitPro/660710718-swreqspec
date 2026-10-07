import { useEffect, useMemo, useState } from 'react'

import { api } from '../api/client.js'

// รองรับ: FR-BKG-01, FR-BKG-06
export default function SlotPicker() {
  const today = useMemo(() => new Date(), [])
  const [selectedPackage, setSelectedPackage] = useState('PKG-A')
  const [slots, setSlots] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSlots = async () => {
      setLoading(true)
      const dateFrom = today.toISOString().slice(0, 10)
      const response = await api.getSlots({ dateFrom, packageCode: selectedPackage })
      const items = Array.isArray(response) ? response : response?.slots ?? []
      setSlots(items)
      setSelectedSlotId(items[0]?.id ?? null)
      setLoading(false)
    }

    loadSlots()
  }, [selectedPackage, today])

  const packageOptions = ['PKG-A', 'PKG-B', 'PKG-C']

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">เลือกแพ็กเกจ</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {packageOptions.map((pkg) => (
            <button
              key={pkg}
              type="button"
              onClick={() => setSelectedPackage(pkg)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selectedPackage === pkg
                  ? 'border-teal-600 bg-teal-600 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-teal-400'
              }`}
            >
              {pkg}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">ช่วงเวลาว่าง</h2>
          <span className="text-sm text-slate-500">{selectedPackage}</span>
        </div>

        {loading ? (
          <p className="text-slate-500">กำลังโหลดช่วงเวลา...</p>
        ) : slots.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-slate-600">
            ไม่มีช่วงเวลาว่างสำหรับแพ็กเกจนี้ในช่วง 30 วันข้างหน้า
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {slots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlotId(slot.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedSlotId === slot.id
                    ? 'border-teal-600 bg-teal-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-teal-300'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-800">{slot.date}</p>
                    <p className="text-sm text-slate-600">{slot.start_time}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                    เหลือ {slot.remaining} ที่
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
