// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading). Berbeda dari
// levels.test.tsx, file ini TIDAK menjalankan kode — isinya murni
// pengecekan TIPE lewat `tsc` (fitur typecheck Vitest), supaya `any` atau
// tipe yang salah tetap ketahuan walau perilakunya "kelihatan" benar.
import type { ComponentProps, MouseEvent } from 'react'
import { expectTypeOf, test } from 'vitest'

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

test('Level 1 - TombolKlik menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof TombolKlik>>().toEqualTypeOf<{
    onKlik: (e: MouseEvent<HTMLButtonElement>) => void
  }>()
})

test('Level 2 - KotakInput menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof KotakInput>>().toEqualTypeOf<{
    onUbah: (nilai: string) => void
  }>()
})

test('Level 3 - KotakCari menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof KotakCari>>().toEqualTypeOf<{
    onCari: (kata: string) => void
  }>()
})

test('Level 4 - FormLogin menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof FormLogin>>().toEqualTypeOf<{
    onLogin: (email: string) => void
  }>()
})

test('Level 5 - Penghitung menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof Penghitung>>().toEqualTypeOf<{ awal?: number }>()
})

test('Level 6 - PenghitungBatas menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof PenghitungBatas>>().toEqualTypeOf<{
    min: number
    max: number
  }>()
})

test('Level 7 - SapaNama tidak menerima props', () => {
  expectTypeOf<Parameters<typeof SapaNama>>().toEqualTypeOf<[]>()
})

test('Level 8 - KalkulatorMini tidak menerima props', () => {
  expectTypeOf<Parameters<typeof KalkulatorMini>>().toEqualTypeOf<[]>()
})

test('Level 9 - DetailToggle menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof DetailToggle>>().toEqualTypeOf<{ isi: string }>()
})

test('Level 10 - FormPesan menerima props bertipe benar (bonus)', () => {
  expectTypeOf<ComponentProps<typeof FormPesan>>().toEqualTypeOf<{
    onKirim: (pesan: string) => void
  }>()
})
