// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading). Berbeda dari
// levels.test.tsx, file ini TIDAK menjalankan kode — isinya murni
// pengecekan TIPE lewat `tsc` (fitur typecheck Vitest), supaya `any` atau
// tipe yang salah tetap ketahuan walau perilakunya "kelihatan" benar.
import type { ComponentProps } from 'react'
import { expectTypeOf, test } from 'vitest'

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

test('Level 1 - JudulHalaman menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof JudulHalaman>>().toEqualTypeOf<{ judul: string }>()
})

test('Level 2 - SapaNama tidak menerima props', () => {
  expectTypeOf<Parameters<typeof SapaNama>>().toEqualTypeOf<[]>()
})

test('Level 3 - Detik tidak menerima props', () => {
  expectTypeOf<Parameters<typeof Detik>>().toEqualTypeOf<[]>()
})

test('Level 4 - PesanSementara menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof PesanSementara>>().toEqualTypeOf<{
    pesan: string
    durasi: number
  }>()
})

test('Level 5 - Stopwatch tidak menerima props', () => {
  expectTypeOf<Parameters<typeof Stopwatch>>().toEqualTypeOf<[]>()
})

test('Level 6 - LebarJendela tidak menerima props', () => {
  expectTypeOf<Parameters<typeof LebarJendela>>().toEqualTypeOf<[]>()
})

test('Level 7 - TekanEsc menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof TekanEsc>>().toEqualTypeOf<{ onEsc: () => void }>()
})

test('Level 8 - CatatanKecil tidak menerima props', () => {
  expectTypeOf<Parameters<typeof CatatanKecil>>().toEqualTypeOf<[]>()
})

test('Level 9 - Countdown menerima props bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof Countdown>>().toEqualTypeOf<{
    detikAwal: number
    onSelesai: () => void
  }>()
})

test('Level 10 - TimerBelajar menerima props bertipe benar (bonus)', () => {
  expectTypeOf<ComponentProps<typeof TimerBelajar>>().toEqualTypeOf<{ detikAwal: number }>()
})
