// TODO(Level 8): komponen TANPA props. Render <textarea> berlabel
// "Catatan" (controlled). Nilai awalnya dibaca dari
// localStorage.getItem("catatan") (kalau belum ada: ""), lewat LAZY
// INITIALIZER useState(() => ...) supaya getItem hanya dipanggil SEKALI.
// Setiap teks berubah, simpan ke localStorage.setItem("catatan", teks) di
// dalam useEffect.
// Lihat SOAL.md untuk kontrak lengkap.
export function CatatanKecil(props: any) {
  return <p>TODO</p>
}
