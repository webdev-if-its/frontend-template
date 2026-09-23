// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading).
import { readFileSync } from 'node:fs'
import type { MouseEvent } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'

import { TombolKlik } from '../components/TombolKlik'
import { KotakInput } from '../components/KotakInput'
import { KotakCari } from '../components/KotakCari'
import { FormLogin } from '../components/FormLogin'
import { Penghitung } from '../components/Penghitung'
import { PenghitungBatas } from '../components/PenghitungBatas'
import { SapaNama } from '../components/SapaNama'
import { KalkulatorMini } from '../components/KalkulatorMini'
import { DetailToggle } from '../components/DetailToggle'
import { FormPesan } from '../components/FormPesan'

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

test('Level 1 - TombolKlik: onClick menerima event klik', async () => {
  let tag = ''
  const onKlik = vi.fn((e: MouseEvent<HTMLButtonElement>) => {
    tag = e.currentTarget.tagName
  })
  const user = userEvent.setup()
  const { unmount } = render(<TombolKlik onKlik={onKlik} />)
  expect(onKlik, 'onKlik tidak boleh terpanggil saat render (jangan tulis onClick={onKlik()})').not.toHaveBeenCalled()
  await user.click(screen.getByRole('button', { name: /klik saya/i }))
  expect(onKlik).toHaveBeenCalledTimes(1)
  expect(tag, 'onKlik harus menerima event klik dari tombolnya').toBe('BUTTON')
  unmount()
})

test('Level 2 - KotakInput: onChange dipanggil tiap ketikan', async () => {
  const onUbah = vi.fn()
  const user = userEvent.setup()
  const { unmount } = render(<KotakInput onUbah={onUbah} />)
  await user.type(screen.getByRole('textbox'), 'abc')
  expect(onUbah).toHaveBeenCalledTimes(3)
  expect(onUbah).toHaveBeenNthCalledWith(1, 'a')
  expect(onUbah).toHaveBeenNthCalledWith(2, 'ab')
  expect(onUbah).toHaveBeenNthCalledWith(3, 'abc')
  unmount()
})

test('Level 3 - KotakCari: onKeyDown hanya bereaksi pada Enter', async () => {
  const onCari = vi.fn()
  const user = userEvent.setup()
  const { unmount } = render(<KotakCari onCari={onCari} />)
  const input = screen.getByRole('textbox')
  await user.type(input, 'react')
  expect(onCari, 'mengetik huruf biasa tidak boleh memicu onCari').not.toHaveBeenCalled()
  await user.keyboard('{Escape}')
  expect(onCari, 'tombol selain Enter tidak boleh memicu onCari').not.toHaveBeenCalled()
  await user.keyboard('{Enter}')
  expect(onCari).toHaveBeenCalledTimes(1)
  expect(onCari).toHaveBeenCalledWith('react')
  unmount()
})

test('Level 4 - FormLogin: onSubmit + preventDefault', async () => {
  const onLogin = vi.fn()
  const user = userEvent.setup()
  const { container, unmount } = render(<FormLogin onLogin={onLogin} />)
  await user.type(screen.getByLabelText(/email/i), 'budi@its.ac.id')
  await user.click(screen.getByRole('button', { name: /masuk/i }))
  expect(onLogin).toHaveBeenCalledTimes(1)
  expect(onLogin).toHaveBeenCalledWith('budi@its.ac.id')

  const form = container.querySelector('form')!
  const tidakDicegah = fireEvent.submit(form)
  expect(tidakDicegah, 'handler onSubmit wajib memanggil e.preventDefault()').toBe(false)
  unmount()
})

test('Level 5 - Penghitung: useState<number>', async () => {
  const user = userEvent.setup()
  const { unmount: u1 } = render(<Penghitung />)
  expect(screen.getByText('Jumlah: 0')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '+' }))
  await user.click(screen.getByRole('button', { name: '+' }))
  expect(screen.getByText('Jumlah: 2')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '-' }))
  expect(screen.getByText('Jumlah: 1')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /reset/i }))
  expect(screen.getByText('Jumlah: 0')).toBeInTheDocument()
  u1()

  const { unmount: u2 } = render(<Penghitung awal={5} />)
  expect(screen.getByText('Jumlah: 5')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '+' }))
  expect(screen.getByText('Jumlah: 6')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /reset/i }))
  expect(screen.getByText('Jumlah: 5'), 'Reset harus kembali ke nilai awal, bukan selalu 0').toBeInTheDocument()
  u2()
})

test('Level 6 - PenghitungBatas: tombol disabled di batas min/max', async () => {
  const user = userEvent.setup()
  const { unmount } = render(<PenghitungBatas min={0} max={2} />)
  expect(screen.getByText('Nilai: 0')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '-' })).toBeDisabled()
  expect(screen.getByRole('button', { name: '+' })).toBeEnabled()
  await user.click(screen.getByRole('button', { name: '+' }))
  await user.click(screen.getByRole('button', { name: '+' }))
  expect(screen.getByText('Nilai: 2')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '+' }), 'di batas max, tombol + harus disabled').toBeDisabled()
  await user.click(screen.getByRole('button', { name: '-' }))
  expect(screen.getByText('Nilai: 1')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '+' })).toBeEnabled()
  unmount()

  const { unmount: u2 } = render(<PenghitungBatas min={3} max={5} />)
  expect(screen.getByText('Nilai: 3'), 'angka harus dimulai dari min').toBeInTheDocument()
  u2()
})

test('Level 7 - SapaNama: controlled input (state string)', async () => {
  const user = userEvent.setup()
  const { unmount } = render(<SapaNama />)
  expect(screen.getByText('Halo, Tamu!')).toBeInTheDocument()
  const input = screen.getByLabelText(/nama/i) as HTMLInputElement
  await user.type(input, 'Budi')
  expect(screen.getByText('Halo, Budi!')).toBeInTheDocument()
  expect(input.value).toBe('Budi')
  await user.clear(input)
  expect(screen.getByText('Halo, Tamu!')).toBeInTheDocument()
  unmount()
})

test('Level 8 - KalkulatorMini: konversi string ke number', async () => {
  const user = userEvent.setup()
  const { unmount } = render(<KalkulatorMini />)
  expect(screen.getByText('Hasil: 0')).toBeInTheDocument()
  await user.type(screen.getByLabelText(/angka a/i), '2')
  await user.type(screen.getByLabelText(/angka b/i), '3')
  expect(screen.getByText('Hasil: 5')).toBeInTheDocument()
  await user.clear(screen.getByLabelText(/angka a/i))
  await user.type(screen.getByLabelText(/angka a/i), '10')
  expect(
    screen.getByText('Hasil: 13'),
    'nilai input harus diubah ke number dulu — jangan sampai "10" + "3" jadi "103"',
  ).toBeInTheDocument()
  unmount()
})

test('Level 9 - DetailToggle: state boolean + tampil/sembunyi', async () => {
  const user = userEvent.setup()
  const { unmount } = render(<DetailToggle isi="Ini detail rahasia." />)
  expect(screen.queryByText('Ini detail rahasia.')).toBeNull()
  await user.click(screen.getByRole('button', { name: /tampilkan detail/i }))
  expect(screen.getByText('Ini detail rahasia.')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /sembunyikan detail/i })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /sembunyikan detail/i }))
  expect(screen.queryByText('Ini detail rahasia.'), 'elemen harus benar-benar hilang dari DOM').toBeNull()
  expect(screen.getByRole('button', { name: /tampilkan detail/i })).toBeInTheDocument()
  unmount()
})

test('Level 10 - FormPesan: gabungan event + state, plus refleksi', async () => {
  const onKirim = vi.fn()
  const user = userEvent.setup()
  const { unmount } = render(<FormPesan onKirim={onKirim} />)
  const tombol = screen.getByRole('button', { name: /kirim/i })
  expect(tombol, 'pesan kosong -> tombol disabled').toBeDisabled()
  const input = screen.getByLabelText(/pesan/i) as HTMLInputElement
  await user.type(input, '   ')
  expect(tombol, 'pesan berisi spasi saja dianggap kosong').toBeDisabled()
  await user.clear(input)
  await user.type(input, '  Halo dunia  ')
  expect(tombol).toBeEnabled()
  await user.click(tombol)
  expect(onKirim).toHaveBeenCalledTimes(1)
  expect(onKirim).toHaveBeenCalledWith('Halo dunia')
  expect(input.value, 'input harus dikosongkan setelah submit').toBe('')
  expect(tombol).toBeDisabled()
  unmount()

  const readme = readFile('../README.md')
  expect(
    filled(section(readme, 'Refleksi Pertemuan 4'), 40),
    "section '## Refleksi Pertemuan 4' belum diisi memadai",
  ).toBe(true)
})
