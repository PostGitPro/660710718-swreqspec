import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import App from '../App.jsx'

vi.mock('../api/client.js', () => ({
  api: {
    getSlots: async () => [
      { id: 1, date: '2026-09-24', start_time: '09:00', remaining: 4, package_code: 'PKG-A' },
      { id: 2, date: '2026-09-24', start_time: '10:00', remaining: 2, package_code: 'PKG-A' },
    ],
  },
}))

test('test_T09_slot_picker_shows_available_slots', async () => {
  render(<App />)

  expect(screen.getByText('ระบบจองคิวตรวจสุขภาพ')).toBeTruthy()
  expect(await screen.findByText('ช่วงเวลาว่าง')).toBeTruthy()
  expect(screen.getByText('09:00')).toBeTruthy()
  expect(screen.getByText('เหลือ 4 ที่')).toBeTruthy()
})
