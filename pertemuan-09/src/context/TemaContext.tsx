// TODO(Level 7-8): buat Context untuk tema aplikasi (tipe Tema ada di
// '../types'):
// - TemaProvider({ children }): menyimpan tema di useState<Tema> (awal:
//   'terang') dan menyediakan { tema, gantiTema } lewat Context Provider.
//   gantiTema() membalik 'terang' <-> 'gelap'.
// - useTema(): custom hook pembungkus useContext yang mengembalikan
//   { tema, gantiTema }, dan MELEMPAR Error yang pesannya menyebut
//   "TemaProvider" kalau dipakai di luar TemaProvider.
// Beri tipe yang tepat — lihat SOAL.md untuk tanda tangan lengkapnya.
export function TemaProvider(props: any) {
  return <>{props.children}</>
}

export function useTema(): any {
  throw new Error('TODO')
}
