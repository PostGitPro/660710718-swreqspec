import SlotPicker from './pages/SlotPicker.jsx'

// รองรับ: FR-BKG-01, FR-BKG-06
export default function App() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-teal-800">ระบบจองคิวตรวจสุขภาพ</h1>
          <p className="mt-2 text-slate-600">เลือกแพ็กเกจและช่วงเวลาตรวจสุขภาพที่ต้องการ</p>
        </header>
        <SlotPicker />
      </div>
    </main>
  )
}
