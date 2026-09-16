// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading). Berbeda dari
// levels.test.tsx, file ini TIDAK menjalankan kode — isinya murni
// pengecekan TIPE lewat `tsc` (fitur typecheck Vitest), supaya `any` atau
// tipe yang salah tetap ketahuan walau perilakunya "kelihatan" benar.
import type { ComponentProps, ReactNode } from 'react'
import { expectTypeOf, test } from 'vitest'

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

test('Level 1 - DaftarBelanja menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof DaftarBelanja>>().toEqualTypeOf<{
    items: { id: string; nama: string }[]
  }>()
})

test('Level 2 - ItemTugas & DaftarTugas menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof ItemTugas>>().toEqualTypeOf<{ tugas: Tugas }>()
  expectTypeOf<ComponentProps<typeof DaftarTugas>>().toEqualTypeOf<{ tugas: Tugas[] }>()
})

test('Level 3 - HasilPencarian menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof HasilPencarian>>().toEqualTypeOf<{
    query: string
    hasil: string[]
  }>()
})

test('Level 4 - LabelStatus menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof LabelStatus>>().toEqualTypeOf<{ selesai: boolean }>()
})

test('Level 5 - Lencana menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof Lencana>>().toEqualTypeOf<{ prioritas: boolean }>()
})

test('Level 6 - KartuTugas menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof KartuTugas>>().toEqualTypeOf<{
    teks: string
    selesai: boolean
  }>()
})

test('Level 7 - Button menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof Button>>().toEqualTypeOf<{
    variant: 'primary' | 'secondary' | 'danger'
    children: ReactNode
    onClick?: () => void
  }>()
})

test('Level 8 - DaftarTugasLengkap menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof DaftarTugasLengkap>>().toEqualTypeOf<{
    tugas: Tugas[]
    onHapus: (id: string) => void
  }>()
})

test('Level 9 - RingkasanTugas menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof RingkasanTugas>>().toEqualTypeOf<{ tugas: Tugas[] }>()
})

test('Level 10 - AplikasiTodo menerima props bertipe benar (bonus)', () => {
  expectTypeOf<ComponentProps<typeof AplikasiTodo>>().toEqualTypeOf<{
    tugas: Tugas[]
    onHapus: (id: string) => void
  }>()
})
