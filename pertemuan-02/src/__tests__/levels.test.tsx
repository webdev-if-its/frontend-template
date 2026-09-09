// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading).
import { readFileSync } from 'node:fs'
import { render, screen } from '@testing-library/react'
import { test, expect, vi } from 'vitest'

import { Profil } from '../components/Profil'
import { Identitas } from '../components/Identitas'
import { Total } from '../components/Total'
import { Kartu } from '../components/Kartu'
import { Halaman } from '../components/Halaman'
import { StatusPesanan } from '../components/StatusPesanan'
import { Sapaan } from '../components/Sapaan'
import { Panel } from '../components/Panel'
import { DaftarTugas } from '../components/DaftarTugas'
import { KartuInfo } from '../components/KartuInfo'

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

test('Level 1 - Profil merender nama & nrp dalam satu root element', () => {
  const { container, unmount } = render(<Profil nama="Budi" nrp="5025201012" />)
  expect(container.children, 'root harus berupa SATU elemen pembungkus').toHaveLength(1)
  expect(container).toHaveTextContent('Budi')
  expect(container).toHaveTextContent('5025201012')
  unmount()

  const readme = readFile('../README.md')
  const s = section(readme, 'JSX vs TSX')
  expect(filled(s, 40), "section '## JSX vs TSX' belum diisi memadai (minimal 40 karakter)").toBe(true)
})

test('Level 2 - Identitas pakai Fragment (tanpa div pembungkus tambahan)', () => {
  const { container, unmount } = render(<Identitas nama="Budi" />)
  expect(container.querySelector('div'), 'jangan bungkus dengan <div>, pakai Fragment <>...</>').toBeNull()
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Budi/)
  expect(screen.getByText(/senang bertemu/i)).toBeInTheDocument()
  unmount()
})

test('Level 3 - Total menghitung qty * harga', () => {
  const { container: c1, unmount: u1 } = render(<Total qty={3} harga={15000} />)
  expect(c1).toHaveTextContent('45000')
  u1()

  const { container: c2, unmount: u2 } = render(<Total qty={2} harga={2500} />)
  expect(c2).toHaveTextContent('5000')
  u2()
})

test('Level 4 - Kartu menerapkan className & style sesuai aturan JSX', () => {
  const { container: c1, unmount: u1 } = render(<Kartu judul="Kartu Aktif" aktif={true} />)
  const el1 = c1.firstElementChild as HTMLElement
  expect(el1.className, 'className harus memuat "aktif" saat prop aktif=true').toContain('aktif')
  expect(el1.style.padding, 'style={{ padding: 16 }} harus diterapkan').toBe('16px')
  expect(c1).toHaveTextContent('Kartu Aktif')
  u1()

  const { container: c2, unmount: u2 } = render(<Kartu judul="Kartu Nonaktif" aktif={false} />)
  const el2 = c2.firstElementChild as HTMLElement
  expect(el2.className, 'className tidak boleh memuat "aktif" saat prop aktif=false').not.toContain('aktif')
  u2()
})

test('Level 5 - Halaman menyusun Header dan Footer lewat komposisi', () => {
  const { container, unmount } = render(<Halaman judul="Beranda" />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Beranda')
  const header = container.querySelector('header')
  const footer = container.querySelector('footer')
  expect(header, '<Header /> harus dirender di dalam <Halaman />').not.toBeNull()
  expect(footer, '<Footer /> harus dirender di dalam <Halaman />').not.toBeNull()
  expect(
    header!.compareDocumentPosition(footer!) & Node.DOCUMENT_POSITION_FOLLOWING,
    'Header harus muncul sebelum Footer',
  ).toBeTruthy()
  unmount()
})

test('Level 6 - StatusPesanan menampilkan teks sesuai status', () => {
  const harapan: Record<string, string> = {
    pending: 'Menunggu',
    selesai: 'Selesai',
    batal: 'Dibatalkan',
  }
  for (const [status, teks] of Object.entries(harapan)) {
    const { unmount } = render(<StatusPesanan status={status as never} />)
    expect(screen.getByText(new RegExp(teks, 'i'))).toBeInTheDocument()
    unmount()
  }

  const readme = readFile('../README.md')
  const s = section(readme, 'Kenapa Union Type untuk Status')
  expect(filled(s, 40), "section '## Kenapa Union Type untuk Status' belum diisi memadai").toBe(true)
})

test('Level 7 - Sapaan pakai default value saat nama tidak diberikan', () => {
  const { unmount: u1 } = render(<Sapaan />)
  expect(screen.getByText(/Halo, Tamu!/)).toBeInTheDocument()
  u1()

  const { unmount: u2 } = render(<Sapaan nama="Sari" />)
  expect(screen.getByText(/Halo, Sari!/)).toBeInTheDocument()
  u2()
})

test('Level 8 - Panel merender judul dan children', () => {
  const { container, unmount } = render(
    <Panel judul="Info">
      <p data-testid="isi">Halo dari children</p>
    </Panel>,
  )
  expect(screen.getByText('Info')).toBeInTheDocument()
  const isi = screen.getByTestId('isi')
  expect(container.contains(isi), 'children harus dirender di dalam Panel').toBe(true)
  unmount()
})

test('Level 9 - DaftarTugas: empty state, list rendering, dan key yang benar', () => {
  const { unmount: u1 } = render(<DaftarTugas tugas={[]} />)
  expect(screen.getByText(/tidak ada tugas/i)).toBeInTheDocument()
  u1()

  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  const { unmount: u2 } = render(
    <DaftarTugas tugas={['Belajar JSX', 'Kerjakan tugas', 'Push ke repo']} />,
  )
  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(3)
  expect(items[0]).toHaveTextContent('Belajar JSX')
  expect(items[2]).toHaveTextContent('Push ke repo')
  const pesanKunciHilang = errorSpy.mock.calls.some((call) =>
    String(call[0]).toLowerCase().includes('key'),
  )
  expect(
    pesanKunciHilang,
    'setiap <li> harus diberi prop key yang unik (React melaporkan warning kalau hilang)',
  ).toBe(false)
  errorSpy.mockRestore()
  u2()
})

test('Level 10 - KartuInfo: catatan opsional & children (bonus), plus refleksi', () => {
  const { container: c1, unmount: u1 } = render(
    <KartuInfo judul="Pengumuman">
      <p>Anak dari KartuInfo</p>
    </KartuInfo>,
  )
  expect(screen.getByText('Pengumuman')).toBeInTheDocument()
  expect(screen.getByText('Anak dari KartuInfo')).toBeInTheDocument()
  expect(c1, 'jangan sampai teks "undefined" muncul saat catatan tidak diisi').not.toHaveTextContent(
    'undefined',
  )
  u1()

  const { unmount: u2 } = render(
    <KartuInfo judul="Pengumuman" catatan="Info tambahan">
      <p>Anak dari KartuInfo</p>
    </KartuInfo>,
  )
  expect(screen.getByText('Info tambahan')).toBeInTheDocument()
  u2()

  const readme = readFile('../README.md')
  expect(filled(section(readme, 'Refleksi'), 40), "section '## Refleksi' belum diisi memadai").toBe(true)
})
