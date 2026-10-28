// TODO(Level 1-2): custom hook useCounter(initial: number = 0) yang
// mengembalikan object { count, increment, decrement, reset }:
// - count: number (mulai dari `initial`),
// - increment(): count + 1, decrement(): count - 1,
// - reset(): kembali ke `initial` (bukan selalu 0).
// Tiap pemanggilan useCounter() punya state SENDIRI. Beri tipe parameter dan
// return yang tepat — lihat SOAL.md untuk tanda tangan lengkapnya.
export function useCounter(initial?: any): any {
  return { count: 0, increment: () => {}, decrement: () => {}, reset: () => {} }
}
