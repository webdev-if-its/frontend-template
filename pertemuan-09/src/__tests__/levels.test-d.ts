// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading). Berbeda dari
// levels.test.tsx, file ini TIDAK menjalankan kode — isinya murni
// pengecekan TIPE lewat `tsc` (fitur typecheck Vitest), supaya `any` atau
// tipe yang salah tetap ketahuan walau perilakunya "kelihatan" benar.
import type { ComponentProps, ReactNode } from 'react'
import { expectTypeOf, test } from 'vitest'

import { useCounter } from '../hooks/useCounter'
import { useToggle } from '../hooks/useToggle'
import { useFetch } from '../hooks/useFetch'
import { TemaProvider, useTema } from '../context/TemaContext'
import { TombolTema } from '../components/TombolTema'
import { LabelTema } from '../components/LabelTema'
import { ProfilPengguna } from '../components/ProfilPengguna'
import type { Tema, User } from '../types'

test('Level 1 - useCounter bertipe benar', () => {
  expectTypeOf(useCounter).toEqualTypeOf<
    (initial?: number) => {
      count: number
      increment: () => void
      decrement: () => void
      reset: () => void
    }
  >()
})

test('Level 3 - useToggle bertipe benar', () => {
  expectTypeOf(useToggle).toEqualTypeOf<
    (awal?: boolean) => {
      nilai: boolean
      toggle: () => void
      setTrue: () => void
      setFalse: () => void
    }
  >()
})

test('Level 4 - useFetch bertipe generic yang tepat', () => {
  expectTypeOf<Parameters<typeof useFetch<User[]>>>().toEqualTypeOf<[url: string]>()
  expectTypeOf<ReturnType<typeof useFetch<User[]>>>().toEqualTypeOf<{
    data: User[] | null
    loading: boolean
    error: string | null
  }>()
  expectTypeOf<ReturnType<typeof useFetch<User>>>().toEqualTypeOf<{
    data: User | null
    loading: boolean
    error: string | null
  }>()
})

test('Level 7 - TemaProvider & useTema bertipe benar', () => {
  expectTypeOf<ComponentProps<typeof TemaProvider>>().toEqualTypeOf<{ children: ReactNode }>()
  expectTypeOf<ReturnType<typeof useTema>>().toEqualTypeOf<{
    tema: Tema
    gantiTema: () => void
  }>()
})

test('Level 9 - TombolTema & LabelTema tidak menerima props', () => {
  expectTypeOf<Parameters<typeof TombolTema>>().toEqualTypeOf<[]>()
  expectTypeOf<Parameters<typeof LabelTema>>().toEqualTypeOf<[]>()
})

test('Level 10 - ProfilPengguna tidak menerima props (bonus)', () => {
  expectTypeOf<Parameters<typeof ProfilPengguna>>().toEqualTypeOf<[]>()
})
