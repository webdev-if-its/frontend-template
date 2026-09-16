// TODO(Level 3): beri tipe props yang benar — { query: string; hasil:
// string[] }. Pakai if/else (di LUAR return, sebelum JSX) untuk tiga
// kemungkinan:
// - query kosong ("")          -> render teks yang memuat "Ketik sesuatu
//                                  untuk mencari"
// - query tidak kosong TAPI
//   hasil.length === 0         -> render teks yang memuat "Tidak ditemukan"
// - selain itu                 -> render <ul> berisi satu <li> per item
//                                  hasil, dengan key yang tepat
// Lihat SOAL.md untuk kontrak lengkap.
export function HasilPencarian(props: any) {
  return <p>TODO</p>
}
