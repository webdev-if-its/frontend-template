// TODO(Level 6-7): komponen TANPA props. Ambil daftar todo lewat getTodos()
// dari '../api/todos' di dalam useEffect (dependency array kosong), lalu:
// - selama data belum datang, render teks "Memuat...",
// - kalau sukses, render <ul> berisi <li> per todo (tampilkan title, key =
//   id) dan "Memuat..." hilang,
// - kalau gagal (error apa pun), render "Terjadi error: {pesan error}" dan
//   "Memuat..." hilang.
// Simpan data/loading/error di useState. JANGAN memanggil fetch() langsung di
// sini (lihat Level 10).
// Lihat SOAL.md untuk kontrak lengkap.
export function DaftarTodoRemote(props: any) {
  return <p>TODO</p>
}
