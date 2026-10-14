// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading). Berbeda dari
// levels.test.tsx, file ini TIDAK menjalankan kode — isinya murni
// pengecekan TIPE lewat `tsc` (fitur typecheck Vitest), supaya `any` atau
// tipe yang salah tetap ketahuan walau perilakunya "kelihatan" benar.
import { expectTypeOf, test } from 'vitest'

import { getTodos, addTodo, updateTodo, hapusTodo } from '../api/todos'
import { DaftarTodoRemote } from '../components/DaftarTodoRemote'
import { AplikasiTodoApi } from '../components/AplikasiTodoApi'
import type { Todo } from '../types'

test('Level 1 - getTodos bertipe benar', () => {
  expectTypeOf(getTodos).toEqualTypeOf<() => Promise<Todo[]>>()
})

test('Level 3 - addTodo bertipe benar', () => {
  expectTypeOf(addTodo).toEqualTypeOf<(title: string) => Promise<Todo>>()
})

test('Level 4 - updateTodo bertipe benar', () => {
  expectTypeOf(updateTodo).toEqualTypeOf<(id: number, completed: boolean) => Promise<Todo>>()
})

test('Level 5 - hapusTodo bertipe benar', () => {
  expectTypeOf(hapusTodo).toEqualTypeOf<(id: number) => Promise<void>>()
})

test('Level 6 - DaftarTodoRemote tidak menerima props', () => {
  expectTypeOf<Parameters<typeof DaftarTodoRemote>>().toEqualTypeOf<[]>()
})

test('Level 8 - AplikasiTodoApi tidak menerima props', () => {
  expectTypeOf<Parameters<typeof AplikasiTodoApi>>().toEqualTypeOf<[]>()
})
