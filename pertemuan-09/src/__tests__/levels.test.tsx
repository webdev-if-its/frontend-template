// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading).
// Semua request jaringan di-mock (fetch palsu) — test TIDAK memanggil internet.
import { readFileSync } from 'node:fs'
import type { ReactNode } from 'react'
import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi, afterEach } from 'vitest'

import { useCounter } from '../hooks/useCounter'
import { useToggle } from '../hooks/useToggle'
import { useFetch } from '../hooks/useFetch'
import { TemaProvider, useTema } from '../context/TemaContext'
import { TombolTema } from '../components/TombolTema'
import { LabelTema } from '../components/LabelTema'
import { ProfilPengguna } from '../components/ProfilPengguna'
import type { User } from '../types'

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
  vi.unstubAllGlobals()
})

function respons(data: unknown, ok = true): Promise<Response> {
  return Promise.resolve({ ok, status: ok ? 200 : 500, json: () => Promise.resolve(data) } as Response)
}
function pasangFetch(handler: (url: string) => Promise<Response>) {
  const fetchMock = vi.fn((url: string | URL | Request) => handler(String(url)))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const bungkusTema = ({ children }: { children: ReactNode }) => <TemaProvider>{children}</TemaProvider>

test('Level 1 - useCounter: increment, decrement, reset', () => {
  const { result } = renderHook(() => useCounter())
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  act(() => result.current.increment())
  expect(result.current.count).toBe(2)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(1)
  act(() => result.current.reset())
  expect(result.current.count).toBe(0)
})

test('Level 2 - useCounter: nilai awal & state terpisah tiap pemanggilan', () => {
  const { result } = renderHook(() => useCounter(10))
  expect(result.current.count).toBe(10)
  act(() => result.current.increment())
  expect(result.current.count).toBe(11)
  act(() => result.current.reset())
  expect(result.current.count, 'reset harus kembali ke nilai awal (10), bukan 0').toBe(10)

  const a = renderHook(() => useCounter(1))
  const b = renderHook(() => useCounter(1))
  act(() => a.result.current.increment())
  expect(a.result.current.count).toBe(2)
  expect(b.result.current.count, 'tiap pemanggilan hook punya state SENDIRI').toBe(1)
})

test('Level 3 - useToggle: custom hook buatan sendiri', () => {
  const { result } = renderHook(() => useToggle())
  expect(result.current.nilai).toBe(false)
  act(() => result.current.toggle())
  expect(result.current.nilai).toBe(true)
  act(() => result.current.toggle())
  expect(result.current.nilai).toBe(false)
  act(() => result.current.setTrue())
  expect(result.current.nilai).toBe(true)
  act(() => result.current.setTrue())
  expect(result.current.nilai).toBe(true)
  act(() => result.current.setFalse())
  expect(result.current.nilai).toBe(false)

  const { result: r2 } = renderHook(() => useToggle(true))
  expect(r2.current.nilai, 'nilai awal harus mengikuti parameter').toBe(true)
})

test('Level 4 - useFetch: loading lalu data', async () => {
  const fetchMock = pasangFetch(() => respons([{ id: 1 }, { id: 2 }]))
  const { result } = renderHook(() => useFetch<{ id: number }[]>('https://contoh.test/data'))
  expect(result.current.loading, 'awalnya loading = true').toBe(true)
  expect(result.current.data).toBeNull()
  expect(result.current.error).toBeNull()
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.data).toEqual([{ id: 1 }, { id: 2 }])
  expect(result.current.error).toBeNull()
  expect(fetchMock).toHaveBeenCalledTimes(1)
  expect(fetchMock.mock.calls[0][0]).toBe('https://contoh.test/data')
})

test('Level 5 - useFetch: state error', async () => {
  pasangFetch(() => respons(null, false))
  const { result, unmount } = renderHook(() => useFetch<string[]>('https://contoh.test/gagal'))
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.data).toBeNull()
  expect(result.current.error, 'res.ok false harus jadi error yang memuat kata "gagal"').toMatch(/gagal/i)
  unmount()

  pasangFetch(() => Promise.reject(new Error('Jaringan putus')))
  const { result: r2 } = renderHook(() => useFetch<string[]>('https://contoh.test/putus'))
  await waitFor(() => expect(r2.current.loading).toBe(false))
  expect(r2.current.data).toBeNull()
  expect(r2.current.error).toBe('Jaringan putus')
})

test('Level 6 - useFetch: fetch ulang saat url berubah', async () => {
  const fetchMock = pasangFetch((url) => respons({ dari: url }))
  const { result, rerender } = renderHook(({ url }) => useFetch<{ dari: string }>(url), {
    initialProps: { url: 'https://contoh.test/satu' },
  })
  await waitFor(() => expect(result.current.data).toEqual({ dari: 'https://contoh.test/satu' }))
  rerender({ url: 'https://contoh.test/dua' })
  expect(result.current.loading, 'url berubah -> loading kembali true').toBe(true)
  await waitFor(() => expect(result.current.data).toEqual({ dari: 'https://contoh.test/dua' }))
  expect(result.current.loading).toBe(false)
  expect(fetchMock).toHaveBeenCalledTimes(2)
  expect(fetchMock.mock.calls[1][0]).toBe('https://contoh.test/dua')
})

test('Level 7 - TemaProvider & useTema: state tema lewat Context', () => {
  const { result } = renderHook(() => useTema(), { wrapper: bungkusTema })
  expect(result.current.tema).toBe('terang')
  act(() => result.current.gantiTema())
  expect(result.current.tema).toBe('gelap')
  act(() => result.current.gantiTema())
  expect(result.current.tema).toBe('terang')
})

test('Level 8 - useTema di luar Provider melempar error', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  expect(() => renderHook(() => useTema())).toThrow(/TemaProvider/)
  errorSpy.mockRestore()
})

test('Level 9 - TombolTema & LabelTema: berbagi state tanpa props', async () => {
  const user = userEvent.setup()
  const { unmount } = render(
    <TemaProvider>
      <TombolTema />
      <LabelTema />
    </TemaProvider>,
  )
  expect(screen.getByRole('button', { name: 'Tema: terang' })).toBeInTheDocument()
  expect(screen.getByText('Tema saat ini: terang')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /tema:/i }))
  expect(screen.getByRole('button', { name: 'Tema: gelap' })).toBeInTheDocument()
  expect(screen.getByText('Tema saat ini: gelap'), 'LabelTema harus ikut berubah lewat Context').toBeInTheDocument()
  unmount()
})

test('Level 10 - ProfilPengguna: useFetch + Context, plus refleksi', async () => {
  const fetchMock = pasangFetch(() => respons({ id: 1, name: 'Leanne Graham', email: 'sincere@april.biz' } satisfies User))
  const user = userEvent.setup()
  const { container, unmount } = render(
    <TemaProvider>
      <TombolTema />
      <ProfilPengguna />
    </TemaProvider>,
  )
  const root = () => container.querySelector('section')!
  expect(screen.getByText(/memuat/i)).toBeInTheDocument()
  expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
  expect(screen.getByText('sincere@april.biz')).toBeInTheDocument()
  expect(screen.queryByText(/memuat/i)).toBeNull()
  expect(fetchMock.mock.calls[0][0]).toBe('https://jsonplaceholder.typicode.com/users/1')
  expect(root().className).toMatch(/bg-white/)
  await user.click(screen.getByRole('button', { name: /tema:/i }))
  expect(root().className, 'tema gelap -> bg-slate-900').toMatch(/bg-slate-900/)
  expect(root().className).not.toMatch(/bg-white/)
  unmount()

  pasangFetch(() => respons(null, false))
  const { unmount: u2 } = render(
    <TemaProvider>
      <ProfilPengguna />
    </TemaProvider>,
  )
  expect(await screen.findByText(/terjadi error/i)).toBeInTheDocument()
  u2()

  const kode = tanpaKomentar(readFile('src/components/ProfilPengguna.tsx'))
  expect(kode, 'ProfilPengguna harus memakai custom hook useFetch').toMatch(/from\s+['"]\.\.\/hooks\/useFetch['"]/)
  expect(kode, 'jangan memanggil fetch() langsung di komponen').not.toMatch(/\bfetch\s*\(/)
  expect(kode, 'ProfilPengguna harus memakai useTema').toMatch(/useTema/)

  const readme = readFile('../README.md')
  expect(
    filled(section(readme, 'Refleksi Pertemuan 10'), 40),
    "section '## Refleksi Pertemuan 10' belum diisi memadai",
  ).toBe(true)
})
