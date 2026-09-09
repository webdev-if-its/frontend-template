// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading). Berbeda dari
// levels.test.tsx, file ini TIDAK menjalankan kode — isinya murni
// pengecekan TIPE lewat `tsc` (fitur typecheck Vitest), supaya `any` atau
// tipe yang salah tetap ketahuan walau perilakunya "kelihatan" benar.
import type { ComponentProps } from 'react'
import { expectTypeOf, test } from 'vitest'

import { Profil } from '../components/Profil'
import { Identitas } from '../components/Identitas'
import { Total } from '../components/Total'
import { Kartu } from '../components/Kartu'
import { Header, Halaman } from '../components/Halaman'
import { StatusPesanan } from '../components/StatusPesanan'
import { Sapaan } from '../components/Sapaan'
import { Panel } from '../components/Panel'
import { DaftarTugas } from '../components/DaftarTugas'
import { KartuInfo } from '../components/KartuInfo'
import type { Status } from '../types'

test('Level 1 - Profil menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof Profil>>().toEqualTypeOf<{ nama: string; nrp: string }>()
})

test('Level 2 - Identitas menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof Identitas>>().toEqualTypeOf<{ nama: string }>()
})

test('Level 3 - Total menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof Total>>().toEqualTypeOf<{ qty: number; harga: number }>()
})

test('Level 4 - Kartu menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof Kartu>>().toEqualTypeOf<{ judul: string; aktif: boolean }>()
})

test('Level 5 - Header & Halaman menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof Header>>().toEqualTypeOf<{ judul: string }>()
  expectTypeOf<ComponentProps<typeof Halaman>>().toEqualTypeOf<{ judul: string }>()
})

test('Level 6 - Status & StatusPesanan bertipe benar', () => {
  expectTypeOf<Status>().toEqualTypeOf<'pending' | 'selesai' | 'batal'>()
  expectTypeOf<ComponentProps<typeof StatusPesanan>>().toEqualTypeOf<{ status: Status }>()
})

test('Level 7 - Sapaan menerima props bertipe benar (nama opsional)', () => {
  expectTypeOf<ComponentProps<typeof Sapaan>>().toEqualTypeOf<{ nama?: string }>()
})

test('Level 8 - Panel menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof Panel>>().toEqualTypeOf<{
    judul: string
    children: import('react').ReactNode
  }>()
})

test('Level 9 - DaftarTugas menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof DaftarTugas>>().toEqualTypeOf<{ tugas: string[] }>()
})

test('Level 10 - KartuInfo menerima props bertipe benar (bonus)', () => {
  expectTypeOf<ComponentProps<typeof KartuInfo>>().toEqualTypeOf<{
    judul: string
    catatan?: string
    children: import('react').ReactNode
  }>()
})
