// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading).
import { readFileSync } from 'node:fs'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'

import { DaftarBelanja } from '../components/DaftarBelanja'
import { ItemTugas } from '../components/ItemTugas'
import { DaftarTugas } from '../components/DaftarTugas'
import { HasilPencarian } from '../components/HasilPencarian'
import { LabelStatus } from '../components/LabelStatus'
import { Lencana } from '../components/Lencana'
import { KartuTugas } from '../components/KartuTugas'
import { Button } from '../components/Button'
import { DaftarTugasLengkap } from '../components/DaftarTugasLengkap'
import { RingkasanTugas } from '../components/RingkasanTugas'
import { AplikasiTodo } from '../components/AplikasiTodo'
import type { Tugas } from '../types'

const placeholder = '(tulis di sini)'

function readFile(path: string): string {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return ''
  }
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

const tugas3: Tugas[] = [
  { id: 't1', teks: 'Belajar JSX', selesai: false },
  { id: 't2', teks: 'Kerjakan tugas', selesai: false },
  { id: 't3', teks: 'Push ke repo', selesai: false },
]

test('Level 1 - DaftarBelanja merender list dengan key yang benar', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  const { unmount } = render(
    <DaftarBelanja
      items={[
        { id: 'b1', nama: 'Roti' },
        { id: 'b2', nama: 'Susu' },
        { id: 'b3', nama: 'Telur' },
      ]}
    />,
  )
  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(3)
  expect(items[0]).toHaveTextContent('Roti')
  expect(items[1]).toHaveTextContent('Susu')
  expect(items[2]).toHaveTextContent('Telur')
  const pesanKunciHilang = errorSpy.mock.calls.some((call) =>
    String(call[0]).toLowerCase().includes('key'),
  )
  expect(pesanKunciHilang, 'tiap <li> harus punya key yang unik (jangan pakai index)').toBe(false)
  errorSpy.mockRestore()
  unmount()
})

test('Level 2 - ItemTugas & DaftarTugas: list lewat komponen terpisah', () => {
  const { container: c1, unmount: u1 } = render(
    <ItemTugas tugas={{ id: 'x1', teks: 'Belajar JSX', selesai: false }} />,
  )
  expect(c1).toHaveTextContent('Belajar JSX')
  u1()

  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  const { unmount: u2 } = render(<DaftarTugas tugas={tugas3} />)
  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(3)
  expect(items[0]).toHaveTextContent('Belajar JSX')
  expect(items[2]).toHaveTextContent('Push ke repo')
  const pesanKunciHilang = errorSpy.mock.calls.some((call) =>
    String(call[0]).toLowerCase().includes('key'),
  )
  expect(pesanKunciHilang, 'key harus ditaruh di <ItemTugas key={...} />').toBe(false)
  errorSpy.mockRestore()
  u2()
})

test('Level 3 - HasilPencarian: if/else tiga kemungkinan', () => {
  const { unmount: u1 } = render(<HasilPencarian query="" hasil={[]} />)
  expect(screen.getByText(/ketik sesuatu untuk mencari/i)).toBeInTheDocument()
  u1()

  const { unmount: u2 } = render(<HasilPencarian query="xyz" hasil={[]} />)
  expect(screen.getByText(/tidak ditemukan/i)).toBeInTheDocument()
  u2()

  const { unmount: u3 } = render(
    <HasilPencarian query="react" hasil={['React Dasar', 'React Router']} />,
  )
  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(2)
  expect(items[0]).toHaveTextContent('React Dasar')
  expect(items[1]).toHaveTextContent('React Router')
  u3()
})

test('Level 4 - LabelStatus: ternary', () => {
  const { unmount: u1 } = render(<LabelStatus selesai={true} />)
  expect(screen.getByText(/selesai/i)).toBeInTheDocument()
  expect(screen.queryByText(/belum selesai/i), 'saat true jangan tampilkan "Belum Selesai"').toBeNull()
  u1()

  const { unmount: u2 } = render(<LabelStatus selesai={false} />)
  expect(screen.getByText(/belum selesai/i)).toBeInTheDocument()
  u2()
})

test('Level 5 - Lencana: logical operator (&&)', () => {
  const { unmount: u1 } = render(<Lencana prioritas={true} />)
  expect(screen.getByText(/prioritas/i)).toBeInTheDocument()
  u1()

  const { unmount: u2 } = render(<Lencana prioritas={false} />)
  expect(
    screen.queryByText(/prioritas/i),
    'saat prioritas=false, elemen lencana TIDAK boleh dirender sama sekali',
  ).toBeNull()
  u2()
})

test('Level 6 - KartuTugas: styling Tailwind & class kondisional', () => {
  const { container: c1, unmount: u1 } = render(<KartuTugas teks="Belum kelar" selesai={false} />)
  const el1 = c1.firstElementChild as HTMLElement
  expect(el1, 'harus ada satu elemen root').not.toBeNull()
  expect(el1.className, 'butuh class padding Tailwind, mis. p-4').toMatch(/\bp[trblxy]?-\d/)
  expect(el1.className, 'butuh class sudut membulat, mis. rounded-xl').toMatch(/\brounded/)
  expect(el1.className, 'butuh class bayangan, mis. shadow-md').toMatch(/\bshadow/)
  expect(el1.className, 'jangan ada line-through saat selesai=false').not.toMatch(/line-through/)
  expect(c1).toHaveTextContent('Belum kelar')
  u1()

  const { container: c2, unmount: u2 } = render(<KartuTugas teks="Sudah kelar" selesai={true} />)
  const el2 = c2.firstElementChild as HTMLElement
  expect(el2.className, 'butuh class line-through saat selesai=true').toMatch(/line-through/)
  u2()
})

test('Level 7 - Button: reusable dengan 3 variant', async () => {
  const { container: cp, unmount: up } = render(<Button variant="primary">Simpan</Button>)
  const clsPrimary = (cp.querySelector('button') as HTMLElement).className
  up()
  const { container: cs, unmount: us } = render(<Button variant="secondary">Simpan</Button>)
  const clsSecondary = (cs.querySelector('button') as HTMLElement).className
  us()
  const { container: cd, unmount: ud } = render(<Button variant="danger">Simpan</Button>)
  const clsDanger = (cd.querySelector('button') as HTMLElement).className
  ud()

  expect(clsPrimary, 'primary & secondary harus tampil beda').not.toBe(clsSecondary)
  expect(clsPrimary, 'primary & danger harus tampil beda').not.toBe(clsDanger)
  expect(clsSecondary, 'secondary & danger harus tampil beda').not.toBe(clsDanger)

  const handleClick = vi.fn()
  const user = userEvent.setup()
  const { unmount } = render(
    <Button variant="danger" onClick={handleClick}>
      Hapus
    </Button>,
  )
  await user.click(screen.getByRole('button', { name: /hapus/i }))
  expect(handleClick).toHaveBeenCalledTimes(1)
  unmount()
})

test('Level 8 - DaftarTugasLengkap: list + kondisional + Button (hapus)', async () => {
  const { unmount: u1 } = render(<DaftarTugasLengkap tugas={[]} onHapus={() => {}} />)
  expect(screen.getByText(/tidak ada tugas/i)).toBeInTheDocument()
  u1()

  const handleHapus = vi.fn()
  const user = userEvent.setup()
  const { unmount: u2 } = render(<DaftarTugasLengkap tugas={tugas3} onHapus={handleHapus} />)
  expect(screen.getByText('Belajar JSX')).toBeInTheDocument()
  expect(screen.getByText('Push ke repo')).toBeInTheDocument()
  const tombolHapus = screen.getAllByRole('button', { name: /hapus/i })
  expect(tombolHapus, 'harus ada satu tombol Hapus per tugas (pakai komponen Button)').toHaveLength(3)
  await user.click(tombolHapus[1])
  expect(handleHapus).toHaveBeenCalledWith('t2')
  u2()
})

test('Level 9 - RingkasanTugas: hitungan & pesan perayaan (&&)', () => {
  const { container: c1, unmount: u1 } = render(
    <RingkasanTugas
      tugas={[
        { id: '1', teks: 'a', selesai: true },
        { id: '2', teks: 'b', selesai: false },
        { id: '3', teks: 'c', selesai: false },
      ]}
    />,
  )
  expect(c1.textContent).toContain('1')
  expect(c1.textContent).toContain('3')
  expect(c1.textContent?.toLowerCase()).toContain('selesai')
  expect(
    screen.queryByText(/semua/i),
    'belum semua tugas selesai, jangan tampilkan pesan perayaan',
  ).toBeNull()
  u1()

  const { container: c2, unmount: u2 } = render(
    <RingkasanTugas
      tugas={[
        { id: '1', teks: 'a', selesai: true },
        { id: '2', teks: 'b', selesai: true },
      ]}
    />,
  )
  expect(screen.getByText(/semua/i), 'semua tugas selesai, harus tampilkan pesan perayaan').toBeInTheDocument()
  u2()

  const { unmount: u3 } = render(<RingkasanTugas tugas={[]} />)
  expect(
    screen.queryByText(/semua/i),
    'tugas KOSONG bukan "semua selesai" - jangan tampilkan pesan perayaan (jebakan .every() pada array kosong)',
  ).toBeNull()
  u3()
})

test('Level 10 - AplikasiTodo: gabungan semua (bonus), plus refleksi', async () => {
  const handleHapus = vi.fn()
  const user = userEvent.setup()
  const { unmount } = render(<AplikasiTodo tugas={tugas3} onHapus={handleHapus} />)
  expect(screen.getByText('Belajar JSX')).toBeInTheDocument()
  expect(screen.getByText(/dari/i)).toBeInTheDocument()
  const tombolHapus = screen.getAllByRole('button', { name: /hapus/i })
  expect(tombolHapus.length).toBeGreaterThan(0)
  await user.click(tombolHapus[0])
  expect(handleHapus).toHaveBeenCalled()
  unmount()

  const readme = readFile('../README.md')
  expect(
    filled(section(readme, 'Refleksi Pertemuan 3'), 40),
    "section '## Refleksi Pertemuan 3' belum diisi memadai",
  ).toBe(true)
})
