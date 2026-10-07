// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading).
// Timer dites dengan jam palsu (vi.useFakeTimers) — test TIDAK menunggu waktu
// sungguhan. Beberapa level dirender di dalam <StrictMode> (seperti main.tsx),
// jadi efek tanpa cleanup yang benar langsung ketahuan.
import { readFileSync } from 'node:fs'
import { StrictMode } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { test, expect, vi, afterEach } from 'vitest'

import { JudulHalaman } from '../components/JudulHalaman'
import { SapaNama } from '../components/SapaNama'
import { Detik } from '../components/Detik'
import { PesanSementara } from '../components/PesanSementara'
import { Stopwatch } from '../components/Stopwatch'
import { LebarJendela } from '../components/LebarJendela'
import { TekanEsc } from '../components/TekanEsc'
import { CatatanKecil } from '../components/CatatanKecil'
import { Countdown } from '../components/Countdown'
import { TimerBelajar } from '../components/TimerBelajar'

const placeholder = '(tulis di sini)'

function readFile(path: string): string {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return ''
  }
}

function tanpaKomentar(kode: string): string {
  return kode.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\s\/\/.*$/gm, '')
}

function section(readme: string, heading: string): string {
  const headingRe = /^##\s+(.+?)\s*$/gim
  const matches = [...readme.matchAll(headingRe)]
  for (let i = 0; i < matches.length; i++) {
    if (matches[i][1].trim().toLowerCase() === heading.toLowerCase()) {
      const start = matches[i].index! + matches[i][0].length
      const end = i + 1 < matches.length ? matches[i + 1].index! : readme.length
      return readme.slice(start, end).trim()
    }
  }
  return ''
}

function filled(text: string, minLen: number): boolean {
  const t = text.trim()
  if (t === '' || t.toLowerCase() === placeholder) return false
  return t.length >= minLen
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  localStorage.clear()
  document.title = ''
})

// Batas waktu longgar: laptop yang sedang sibuk/lambat tidak boleh membuat test gagal.
const T = { timeout: 20_000 }

const maju = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

test('Level 1 - JudulHalaman: useEffect mengubah document.title', T, () => {
  const { rerender, unmount } = render(<JudulHalaman judul="Beranda" />)
  expect(document.title).toBe('Beranda')
  expect(screen.getByRole('heading', { name: 'Beranda' })).toBeInTheDocument()

  rerender(<JudulHalaman judul="Tentang" />)
  expect(document.title, 'prop judul berubah -> efek harus jalan lagi (cek dependency array)').toBe('Tentang')
  expect(screen.getByRole('heading', { name: 'Tentang' })).toBeInTheDocument()
  unmount()

  const kode = tanpaKomentar(readFile('src/components/JudulHalaman.tsx'))
  expect(kode, 'document.title harus diubah di dalam useEffect, bukan di badan komponen').toMatch(/useEffect\s*\(/)
})

test('Level 2 - SapaNama: dependency array melewati state lain', T, () => {
  const setJudul = vi.spyOn(document, 'title', 'set')
  render(<SapaNama />)
  expect(document.title).toBe('Halo, Tamu')

  fireEvent.change(screen.getByLabelText(/nama/i), { target: { value: 'Budi' } })
  expect(document.title).toBe('Halo, Budi')
  const sesudahNama = setJudul.mock.calls.length

  fireEvent.click(screen.getByText('+1'))
  fireEvent.click(screen.getByText('+1'))
  expect(screen.getByText('Klik: 2')).toBeInTheDocument()
  expect(
    setJudul.mock.calls.length,
    'klik tombol +1 tidak boleh menjalankan ulang efek — dependency array-nya harus [nama]',
  ).toBe(sesudahNama)

  const kode = tanpaKomentar(readFile('src/components/SapaNama.tsx'))
  expect(kode, 'document.title harus diubah di dalam useEffect').toMatch(/useEffect\s*\(/)
})

test('Level 3 - Detik: setInterval + cleanup', T, () => {
  vi.useFakeTimers()
  const { unmount } = render(
    <StrictMode>
      <Detik />
    </StrictMode>,
  )
  expect(screen.getByText('Detik: 0')).toBeInTheDocument()
  maju(1000)
  expect(screen.getByText('Detik: 1'), 'timer menumpuk? pastikan efek punya cleanup (clearInterval)').toBeInTheDocument()
  maju(2000)
  expect(screen.getByText('Detik: 3')).toBeInTheDocument()
  expect(vi.getTimerCount(), 'hanya boleh ada SATU timer aktif').toBe(1)

  unmount()
  expect(vi.getTimerCount(), 'setelah komponen dilepas tidak boleh ada timer tersisa').toBe(0)
})

test('Level 4 - PesanSementara: setTimeout, reset saat pesan berganti', T, () => {
  vi.useFakeTimers()
  const { rerender, unmount } = render(<PesanSementara pesan="Tersimpan" durasi={1000} />)
  expect(screen.getByText('Tersimpan')).toBeInTheDocument()
  maju(999)
  expect(screen.getByText('Tersimpan')).toBeInTheDocument()
  maju(1)
  expect(screen.queryByText('Tersimpan'), 'setelah durasi habis, pesan harus hilang dari DOM').toBeNull()

  rerender(<PesanSementara pesan="Baru" durasi={1000} />)
  expect(screen.getByText('Baru'), 'pesan berganti -> harus tampil lagi').toBeInTheDocument()
  maju(600)
  rerender(<PesanSementara pesan="Lebih Baru" durasi={1000} />)
  expect(screen.getByText('Lebih Baru')).toBeInTheDocument()
  maju(600)
  expect(screen.getByText('Lebih Baru'), 'timer lama harus dibersihkan & hitung mundur mulai dari awal').toBeInTheDocument()
  maju(400)
  expect(screen.queryByText('Lebih Baru')).toBeNull()

  rerender(<PesanSementara pesan="Terakhir" durasi={5000} />)
  unmount()
  expect(vi.getTimerCount(), 'setelah komponen dilepas tidak boleh ada timer tersisa').toBe(0)
})

test('Level 5 - Stopwatch: start/stop dengan [jalan]', T, () => {
  vi.useFakeTimers()
  render(
    <StrictMode>
      <Stopwatch />
    </StrictMode>,
  )
  expect(screen.getByText('0 detik')).toBeInTheDocument()
  fireEvent.click(screen.getByText('Start'))
  expect(screen.getByText('Stop')).toBeInTheDocument()
  maju(2000)
  expect(screen.getByText('2 detik')).toBeInTheDocument()

  fireEvent.click(screen.getByText('Stop'))
  expect(screen.getByText('Start')).toBeInTheDocument()
  expect(vi.getTimerCount(), 'setelah Stop tidak boleh ada timer tersisa (cleanup)').toBe(0)
  maju(3000)
  expect(screen.getByText('2 detik')).toBeInTheDocument()

  fireEvent.click(screen.getByText('Start'))
  maju(1000)
  expect(screen.getByText('3 detik'), 'Start lagi harus melanjutkan dari angka terakhir').toBeInTheDocument()
})

test('Level 6 - LebarJendela: listener resize + cleanup', T, () => {
  const pasang = vi.spyOn(window, 'addEventListener')
  const lepas = vi.spyOn(window, 'removeEventListener')
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 800 })

  const { unmount } = render(
    <StrictMode>
      <LebarJendela />
    </StrictMode>,
  )
  expect(screen.getByText('Lebar jendela: 800px')).toBeInTheDocument()

  window.innerWidth = 500
  act(() => {
    window.dispatchEvent(new Event('resize'))
  })
  expect(screen.getByText('Lebar jendela: 500px')).toBeInTheDocument()
  unmount()

  const dipasang = pasang.mock.calls.filter(([jenis]) => jenis === 'resize')
  const dilepas = lepas.mock.calls.filter(([jenis]) => jenis === 'resize')
  expect(dipasang.length, 'listener resize harus dipasang').toBeGreaterThan(0)
  for (const [, handler] of dipasang) {
    expect(
      dilepas.some(([, h]) => h === handler),
      'removeEventListener harus menerima fungsi yang SAMA persis dengan yang dipasang',
    ).toBe(true)
  }
})

test('Level 7 - TekanEsc: keydown listener, cleanup & onEsc terbaru', T, () => {
  const fn1 = vi.fn()
  const fn2 = vi.fn()
  const { rerender, unmount } = render(
    <StrictMode>
      <TekanEsc onEsc={fn1} />
    </StrictMode>,
  )
  expect(screen.getByText('Tekan Esc untuk menutup')).toBeInTheDocument()

  fireEvent.keyDown(document.body, { key: 'a' })
  expect(fn1, 'tombol selain Escape tidak boleh memanggil onEsc').not.toHaveBeenCalled()
  fireEvent.keyDown(document.body, { key: 'Escape' })
  expect(fn1, 'Escape sekali = onEsc sekali (listener menumpuk? cek cleanup)').toHaveBeenCalledTimes(1)

  rerender(
    <StrictMode>
      <TekanEsc onEsc={fn2} />
    </StrictMode>,
  )
  fireEvent.keyDown(document.body, { key: 'Escape' })
  expect(fn2, 'prop onEsc berganti -> yang dipanggil harus fungsi yang baru').toHaveBeenCalledTimes(1)
  expect(fn1, 'fungsi lama tidak boleh dipanggil lagi').toHaveBeenCalledTimes(1)

  unmount()
  fireEvent.keyDown(document.body, { key: 'Escape' })
  expect(fn2, 'setelah komponen dilepas, listener harus sudah dilepas').toHaveBeenCalledTimes(1)
})

test('Level 8 - CatatanKecil: lazy initializer + simpan ke localStorage', T, () => {
  localStorage.setItem('catatan', 'catatan lama')
  const getItem = vi.spyOn(Storage.prototype, 'getItem')

  const { unmount } = render(<CatatanKecil />)
  const kotak = screen.getByLabelText('Catatan') as HTMLTextAreaElement
  expect(kotak.value).toBe('catatan lama')

  fireEvent.change(kotak, { target: { value: 'baru 1' } })
  fireEvent.change(kotak, { target: { value: 'baru 12' } })
  fireEvent.change(kotak, { target: { value: 'baru 123' } })
  const jumlahGetItem = getItem.mock.calls.length
  expect(jumlahGetItem, 'getItem harus dipanggil SEKALI saja — pakai lazy initializer useState(() => ...)').toBe(1)
  expect(localStorage.getItem('catatan'), 'setiap teks berubah, nilainya harus tersimpan').toBe('baru 123')
  unmount()

  render(<CatatanKecil />)
  expect((screen.getByLabelText('Catatan') as HTMLTextAreaElement).value, 'dipasang ulang -> teks terakhir muncul lagi').toBe('baru 123')

  const kode = tanpaKomentar(readFile('src/components/CatatanKecil.tsx'))
  expect(kode, 'penyimpanan harus dilakukan di dalam useEffect').toMatch(/useEffect\s*\([\s\S]*setItem/)
})

test('Level 9 - Countdown: berhenti di 0, onSelesai sekali', T, () => {
  vi.useFakeTimers()
  const onSelesai = vi.fn()
  render(<Countdown detikAwal={3} onSelesai={onSelesai} />)
  expect(screen.getByText('Sisa: 3')).toBeInTheDocument()
  maju(1000)
  expect(screen.getByText('Sisa: 2')).toBeInTheDocument()
  expect(onSelesai).not.toHaveBeenCalled()
  maju(2000)
  expect(screen.getByText('Sisa: 0')).toBeInTheDocument()
  expect(onSelesai).toHaveBeenCalledTimes(1)

  maju(5000)
  expect(screen.getByText('Sisa: 0'), 'hitung mundur tidak boleh negatif').toBeInTheDocument()
  expect(onSelesai, 'onSelesai hanya boleh terpanggil SEKALI').toHaveBeenCalledTimes(1)
  expect(vi.getTimerCount(), 'setelah selesai tidak boleh ada timer tersisa').toBe(0)
})

test('Level 9 - Countdown: dilepas di tengah jalan', T, () => {
  vi.useFakeTimers()
  const onSelesai = vi.fn()
  const { unmount } = render(<Countdown detikAwal={5} onSelesai={onSelesai} />)
  maju(2000)
  expect(screen.getByText('Sisa: 3')).toBeInTheDocument()
  unmount()
  expect(vi.getTimerCount(), 'timer harus dibersihkan saat komponen dilepas').toBe(0)
  maju(10000)
  expect(onSelesai, 'onSelesai tidak boleh terpanggil setelah komponen dilepas').not.toHaveBeenCalled()
})

test('Level 10 - TimerBelajar: gabungan semua materi, plus refleksi', T, () => {
  vi.useFakeTimers()
  document.title = 'Judul Awal'
  const { unmount } = render(
    <StrictMode>
      <TimerBelajar detikAwal={3} />
    </StrictMode>,
  )
  expect(screen.getByText('Sisa: 3 detik')).toBeInTheDocument()
  expect(document.title).toBe('Sisa: 3 detik')
  expect(vi.getTimerCount(), 'sebelum Mulai tidak boleh ada timer').toBe(0)

  fireEvent.click(screen.getByText('Mulai'))
  maju(1000)
  expect(screen.getByText('Sisa: 2 detik')).toBeInTheDocument()
  expect(document.title, 'judul tab harus ikut berubah').toBe('Sisa: 2 detik')

  fireEvent.click(screen.getByText('Jeda'))
  expect(vi.getTimerCount(), 'setelah Jeda tidak boleh ada timer tersisa').toBe(0)
  maju(3000)
  expect(screen.getByText('Sisa: 2 detik')).toBeInTheDocument()

  fireEvent.click(screen.getByText('Reset'))
  expect(screen.getByText('Sisa: 3 detik')).toBeInTheDocument()
  expect(screen.getByText('Mulai'), 'Reset juga menghentikan timer').toBeInTheDocument()
  expect(vi.getTimerCount()).toBe(0)

  fireEvent.click(screen.getByText('Mulai'))
  maju(3000)
  expect(screen.getByText('Sisa: 0 detik')).toBeInTheDocument()
  expect(screen.getByText('Selesai!')).toBeInTheDocument()
  expect(vi.getTimerCount(), 'saat selesai timer harus berhenti otomatis').toBe(0)
  expect(screen.getByText('Mulai').closest('button')).toBeDisabled()

  unmount()
  expect(document.title, 'saat komponen dilepas judul tab harus kembali seperti semula (cleanup)').toBe('Judul Awal')

  const readme = readFile('../README.md')
  expect(
    filled(section(readme, 'Refleksi Pertemuan 6'), 40),
    "section '## Refleksi Pertemuan 6' belum diisi memadai",
  ).toBe(true)
})
