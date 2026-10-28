// TODO(Level 3): custom hook useToggle(awal: boolean = false) yang
// mengembalikan object { nilai, toggle, setTrue, setFalse }:
// - nilai: boolean (mulai dari `awal`),
// - toggle(): membalik nilai, setTrue(): jadi true, setFalse(): jadi false.
// Beri tipe parameter dan return yang tepat — lihat SOAL.md.
export function useToggle(awal?: any): any {
  return { nilai: false, toggle: () => {}, setTrue: () => {}, setFalse: () => {} }
}
