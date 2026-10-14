// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading).
// Semua request jaringan di-mock (fetch palsu) — test TIDAK memanggil internet.
import { readFileSync, readdirSync } from 'node:fs'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi, afterEach } from 'vitest'

import { getTodos, addTodo, updateTodo, hapusTodo } from '../api/todos'
import { DaftarTodoRemote } from '../components/DaftarTodoRemote'
import { AplikasiTodoApi } from '../components/AplikasiTodoApi'
import type { Todo } from '../types'

const BASE = 'https://jsonplaceholder.typicode.com/todos'
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

const todoA: Todo = { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
const todoB: Todo = { userId: 1, id: 2, title: 'quis ut nam facilis', completed: true }

function respons(data: unknown, ok = true): Promise<Response> {
  return Promise.resolve({ ok, status: ok ? 200 : 500, json: () => Promise.resolve(data) } as Response)
}

type Init = RequestInit | undefined
function pasangFetch(handler: (url: string, init: Init) => Promise<Response>) {
  const fetchMock = vi.fn((url: string | URL | Request, init?: RequestInit) => handler(String(url), init))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
function metode(init: Init): string {
  return (init?.method ?? 'GET').toUpperCase()
}
function jenisKonten(init: Init): string | null {
  return new Headers(init?.headers).get('content-type')
}

test('Level 1 - getTodos: GET ke JSONPlaceholder', async () => {
  const fetchMock = pasangFetch(() => respons([todoA, todoB]))
  const hasil = await getTodos()
  expect(hasil).toEqual([todoA, todoB])
  expect(fetchMock).toHaveBeenCalledTimes(1)
  expect(fetchMock.mock.calls[0][0], 'alamat request harus persis endpoint /todos').toBe(BASE)
  expect(metode(fetchMock.mock.calls[0][1])).toBe('GET')
})

test('Level 2 - getTodos: melempar error kalau respons gagal', async () => {
  pasangFetch(() => respons(null, false))
  await expect(getTodos(), 'res.ok === false harus dilempar sebagai Error (fetch tidak otomatis throw)').rejects.toThrow(/gagal/i)
})

test('Level 3 - addTodo: POST + header + body JSON', async () => {
  const fetchMock = pasangFetch(() => respons({ ...todoA, id: 201, title: 'Todo baru' }))
  const hasil = await addTodo('Todo baru')
  expect(hasil).toEqual({ ...todoA, id: 201, title: 'Todo baru' })
  const [url, init] = fetchMock.mock.calls[0]
  expect(url).toBe(BASE)
  expect(metode(init)).toBe('POST')
  expect(jenisKonten(init), 'header Content-Type harus application/json').toBe('application/json')
  expect(typeof init?.body, 'body harus berupa string (JSON.stringify)').toBe('string')
  const body = JSON.parse(String(init?.body))
  expect(body.title).toBe('Todo baru')
  expect(body.completed).toBe(false)

  pasangFetch(() => respons(null, false))
  await expect(addTodo('x')).rejects.toThrow(/gagal/i)
})

test('Level 4 - updateTodo: PUT ke /todos/:id', async () => {
  const fetchMock = pasangFetch(() => respons({ ...todoA, completed: true }))
  const hasil = await updateTodo(1, true)
  expect(hasil).toEqual({ ...todoA, completed: true })
  const [url, init] = fetchMock.mock.calls[0]
  expect(url, 'alamat harus menyertakan id: /todos/1').toBe(`${BASE}/1`)
  expect(metode(init)).toBe('PUT')
  expect(jenisKonten(init)).toBe('application/json')
  expect(JSON.parse(String(init?.body)).completed).toBe(true)

  pasangFetch(() => respons(null, false))
  await expect(updateTodo(1, true)).rejects.toThrow(/gagal/i)
})

test('Level 5 - hapusTodo: DELETE ke /todos/:id', async () => {
  const fetchMock = pasangFetch(() => respons({}))
  const hasil = await hapusTodo(7)
  expect(hasil, 'hapusTodo tidak perlu mengembalikan nilai').toBeUndefined()
  const [url, init] = fetchMock.mock.calls[0]
  expect(url).toBe(`${BASE}/7`)
  expect(metode(init)).toBe('DELETE')

  pasangFetch(() => respons(null, false))
  await expect(hapusTodo(7)).rejects.toThrow(/gagal/i)
})

test('Level 6 - DaftarTodoRemote: loading lalu data', async () => {
  let selesaikan: (r: Response) => void = () => {}
  pasangFetch(() => new Promise<Response>((res) => { selesaikan = res }))
  const { unmount } = render(<DaftarTodoRemote />)
  expect(screen.getByText(/memuat/i), 'selama menunggu respons harus tampil "Memuat..."').toBeInTheDocument()

  selesaikan(await respons([todoA, todoB]))
  expect(await screen.findByText('delectus aut autem')).toBeInTheDocument()
  expect(screen.getAllByRole('listitem')).toHaveLength(2)
  expect(screen.getByText('quis ut nam facilis')).toBeInTheDocument()
  expect(screen.queryByText(/memuat/i), '"Memuat..." harus hilang setelah data datang').toBeNull()
  unmount()
})

test('Level 7 - DaftarTodoRemote: menampilkan error', async () => {
  pasangFetch(() => respons(null, false))
  const { unmount: u1 } = render(<DaftarTodoRemote />)
  expect(await screen.findByText(/terjadi error/i)).toBeInTheDocument()
  expect(screen.queryByText(/memuat/i), '"Memuat..." harus hilang saat error').toBeNull()
  expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  u1()

  pasangFetch(() => Promise.reject(new Error('Jaringan putus')))
  const { unmount: u2 } = render(<DaftarTodoRemote />)
  expect(await screen.findByText(/terjadi error: jaringan putus/i), 'pesan error dari err.message harus ikut tampil').toBeInTheDocument()
  u2()
})

function apiPalsu() {
  let daftar: Todo[] = [{ ...todoA }, { ...todoB }]
  return pasangFetch((url, init) => {
    const m = metode(init)
    if (url === BASE && m === 'GET') return respons(daftar)
    if (url === BASE && m === 'POST') {
      const body = JSON.parse(String(init?.body))
      const baru: Todo = { userId: 1, id: 201, title: body.title, completed: false }
      daftar = [...daftar, baru]
      return respons(baru)
    }
    const id = Number(url.slice(BASE.length + 1))
    if (m === 'PUT') {
      const body = JSON.parse(String(init?.body))
      const hasil = { ...daftar.find((t) => t.id === id)!, completed: body.completed }
      daftar = daftar.map((t) => (t.id === id ? hasil : t))
      return respons(hasil)
    }
    if (m === 'DELETE') {
      daftar = daftar.filter((t) => t.id !== id)
      return respons({})
    }
    return respons(null, false)
  })
}

test('Level 8 - AplikasiTodoApi: memuat daftar & menambah todo (POST)', async () => {
  const fetchMock = apiPalsu()
  const user = userEvent.setup()
  const { unmount } = render(<AplikasiTodoApi />)
  expect(await screen.findByLabelText('delectus aut autem')).not.toBeChecked()
  expect(screen.getByLabelText('quis ut nam facilis')).toBeChecked()
  expect(screen.getAllByRole('listitem')).toHaveLength(2)

  const input = screen.getByLabelText(/todo baru/i) as HTMLInputElement
  await user.type(input, 'Belajar fetch')
  await user.click(screen.getByRole('button', { name: /tambah/i }))
  expect(await screen.findByLabelText('Belajar fetch')).not.toBeChecked()
  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(3)
  expect(items[2]).toHaveTextContent('Belajar fetch')
  expect(input.value, 'input harus dikosongkan setelah tambah').toBe('')
  const post = fetchMock.mock.calls.find(([, init]) => metode(init) === 'POST')
  expect(post, 'harus ada request POST ke API').toBeDefined()
  expect(JSON.parse(String(post![1]?.body)).title).toBe('Belajar fetch')
  unmount()
})

test('Level 9 - AplikasiTodoApi: toggle (PUT) & hapus (DELETE)', async () => {
  const fetchMock = apiPalsu()
  const user = userEvent.setup()
  const { unmount } = render(<AplikasiTodoApi />)
  const cek = await screen.findByLabelText('delectus aut autem')

  await user.click(cek)
  await vi.waitFor(() => expect(screen.getByLabelText('delectus aut autem')).toBeChecked())
  const put = fetchMock.mock.calls.find(([, init]) => metode(init) === 'PUT')
  expect(put, 'harus ada request PUT ke API').toBeDefined()
  expect(put![0]).toBe(`${BASE}/1`)
  expect(JSON.parse(String(put![1]?.body)).completed).toBe(true)
  expect(screen.getByLabelText('quis ut nam facilis'), 'todo lain tidak boleh berubah').toBeChecked()

  const baris2 = screen.getAllByRole('listitem')[1]
  await user.click(within(baris2).getByRole('button', { name: /hapus/i }))
  await vi.waitFor(() => expect(screen.queryByText('quis ut nam facilis')).toBeNull())
  const del = fetchMock.mock.calls.find(([, init]) => metode(init) === 'DELETE')
  expect(del, 'harus ada request DELETE ke API').toBeDefined()
  expect(del![0]).toBe(`${BASE}/2`)
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  unmount()
})

test('Level 10 - Separation of concerns: komponen tidak memanggil fetch langsung, plus refleksi', () => {
  const berkas = readdirSync('src/components').filter((f) => f.endsWith('.tsx'))
  expect(berkas.length).toBeGreaterThan(0)
  for (const f of berkas) {
    const kode = tanpaKomentar(readFile(`src/components/${f}`))
    expect(kode, `${f}: jangan memanggil fetch() di komponen — pindahkan ke src/api/todos.ts`).not.toMatch(/\bfetch\s*\(/)
  }
  const app = tanpaKomentar(readFile('src/components/AplikasiTodoApi.tsx'))
  expect(app, 'AplikasiTodoApi harus memakai fungsi dari ../api/todos').toMatch(/from\s+['"]\.\.\/api\/todos['"]/)
  const daftar = tanpaKomentar(readFile('src/components/DaftarTodoRemote.tsx'))
  expect(daftar, 'DaftarTodoRemote harus memakai fungsi dari ../api/todos').toMatch(/from\s+['"]\.\.\/api\/todos['"]/)

  const readme = readFile('../README.md')
  expect(
    filled(section(readme, 'Refleksi Pertemuan 9'), 40),
    "section '## Refleksi Pertemuan 9' belum diisi memadai",
  ).toBe(true)
})
