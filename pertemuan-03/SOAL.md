# Pertemuan 3 — List Rendering, Conditional Rendering, Tailwind CSS & Komponen Reusable

Tugas ini melatih **menampilkan data berulang dengan aman**, **menampilkan elemen secara kondisional** (tiga cara: if/else, ternary, `&&`), **styling cepat lewat Tailwind CSS**, dan **merancang komponen reusable** lewat prop `variant`. **Soal ini sengaja tidak menunjukkan kode JSX jadi** — tiap level hanya menjelaskan *kontrak* komponennya (nama, props, perilaku yang diharapkan). Bagaimana cara menulisnya adalah bagian yang harus kalian pikirkan dan coba sendiri.

Karena project ini TypeScript, **tiap level dicek dua arah**: perilaku (komponennya benar-benar bekerja, lewat React Testing Library) **dan** tipe (props-nya benar-benar bertipe tepat, bukan `any` — lewat fitur typecheck Vitest). Kalau kalian ganti tipe props jadi `any` supaya "aman", test tipe level itu akan tetap gagal walau perilakunya kelihatan benar.

Nilai mengikuti **level tertinggi yang lolos test secara berurutan** (kalau Level 3 gagal, Level 8 tidak dihitung meski lolos) — kerjakan sejauh kemampuan. Kalian **boleh mengerjakan tidak berurutan** — `npm run levels` tetap menunjukkan level mana saja yang benar-benar lolos apa adanya.

## Cara Kerja Folder Ini

Tailwind CSS **sudah dipasang dan siap pakai** di project ini (lewat `@tailwindcss/vite`) — kalian tidak perlu setup apa pun, tinggal pakai className Tailwind langsung di JSX.

```bash
cd pertemuan-03
npm install       # sekali di awal
npm run dev       # lihat progresmu di browser (App.tsx merender tiap komponen)
npm run levels    # cek level mana yang sudah lolos
npm run build     # pastikan project tetap bisa di-build
```

Semua level akan **gagal** di awal — itu normal, kalian belum mengedit apa-apa. File di `src/__tests__/` (`levels.test.tsx` dan `levels.test-d.ts`) **jangan diedit** — dosen menimpa ulang keduanya sebelum menilai.

Level 10 juga butuh isian di **`README.md` milik repo kalian sendiri** (bukan file di folder ini) — heading `## Refleksi Pertemuan 3` sudah disiapkan di sana.

---

## Level 1 — Komponen `DaftarBelanja` (Menampilkan List Data)

Di `src/components/DaftarBelanja.tsx`, buat **`DaftarBelanja`** yang menerima props **`items`**: daftar objek `{ id: string; nama: string }`. Render sebuah `<ul>` berisi satu `<li>` per item, memuat `nama`-nya.

**Dicek otomatis:** 3 item menghasilkan tepat 3 `<li>` dengan urutan & isi yang benar; **tidak ada warning React soal `key`** (pakai `item.id`, jangan pakai index array); props bertipe `{ items: { id: string; nama: string }[] }`.

## Level 2 — Komponen `ItemTugas` & `DaftarTugas` (List + Component + Props)

Di `src/types.ts` sudah tersedia tipe `Tugas = { id: string; teks: string; selesai: boolean }` — pakai ini, jangan tulis ulang bentuknya.

Di `src/components/ItemTugas.tsx`, buat **`ItemTugas`** yang menerima props **`tugas`** (satu `Tugas`), merender `<li>` berisi `tugas.teks`.

Di `src/components/DaftarTugas.tsx`, buat **`DaftarTugas`** yang menerima props **`tugas`** (daftar `Tugas`), merender `<ul>` berisi satu **`<ItemTugas key={...} tugas={...} />`** per elemen — **manfaatkan kembali** `ItemTugas`, jangan tulis ulang markup-nya di sini.

**Dicek otomatis:** `ItemTugas` merender teks tugas yang benar; `DaftarTugas` dengan 3 tugas menghasilkan 3 `<li>` sesuai urutan, tanpa warning `key`; props `ItemTugas` bertipe `{ tugas: Tugas }`, props `DaftarTugas` bertipe `{ tugas: Tugas[] }`.

## Level 3 — Komponen `HasilPencarian` (If/Else Conditional Rendering)

Di `src/components/HasilPencarian.tsx`, buat **`HasilPencarian`** yang menerima props **`query`** (teks) dan **`hasil`** (daftar teks). Pakai **if/else** (di luar JSX, sebelum `return`) untuk tiga kemungkinan:
- `query` kosong (`""`) → render teks yang memuat **"Ketik sesuatu untuk mencari"**.
- `query` tidak kosong, tapi `hasil` kosong → render teks yang memuat **"Tidak ditemukan"**.
- Selain itu → render `<ul>` berisi satu `<li>` per item `hasil`, dengan `key` yang tepat.

**Dicek otomatis:** ketiga skenario merender teks/elemen yang benar (termasuk jumlah `<li>` untuk skenario ketiga); props bertipe `{ query: string; hasil: string[] }`.

## Level 4 — Komponen `LabelStatus` (Ternary Operator)

Di `src/components/LabelStatus.tsx`, buat **`LabelStatus`** yang menerima props **`selesai`** (boolean). Pakai **ternary** (`? :`) di dalam JSX untuk menampilkan teks **"Selesai"** saat `true`, atau **"Belum Selesai"** saat `false`.

**Dicek otomatis:** kedua nilai `selesai` merender teks yang benar (dan TIDAK memuat teks kondisi yang salah, mis. saat `true` tidak boleh ada "Belum Selesai"); props bertipe `{ selesai: boolean }`.

## Level 5 — Komponen `Lencana` (Logical Operator `&&`)

Di `src/components/Lencana.tsx`, buat **`Lencana`** yang menerima props **`prioritas`** (boolean). Pakai **logical operator (`&&`)** di dalam JSX: render sebuah elemen yang memuat kata **"Prioritas"** HANYA kalau `prioritas` bernilai `true` — kalau `false`, elemen itu **tidak boleh dirender sama sekali** (bukan cuma disembunyikan lewat CSS/`display:none`).

**Dicek otomatis:** saat `true`, teks "Prioritas" muncul di DOM; saat `false`, query pencarian teks itu mengembalikan `null` (elemen benar-benar tidak ada); props bertipe `{ prioritas: boolean }`.

## Level 6 — Komponen `KartuTugas` (Tailwind CSS)

Di `src/components/KartuTugas.tsx`, buat **`KartuTugas`** yang menerima props **`teks`** (teks) dan **`selesai`** (boolean). Render **satu elemen root** dengan className Tailwind yang:
- punya utility untuk **padding** (mis. `p-4`),
- punya utility untuk **sudut membulat** (mis. `rounded-xl`),
- punya utility untuk **bayangan** (mis. `shadow-md`),
- **tambahan** class literal **`line-through`** di className HANYA saat `selesai` bernilai `true` (tidak ada sama sekali saat `false`),
- memuat teks `teks` di dalamnya.

Nama class persis untuk padding/rounded/shadow bebas kalian pilih (yang dicek adalah kategorinya) — tapi untuk coretan teks, **harus** literal `line-through` (nama utility Tailwind resminya, tidak ada sinonim).

**Dicek otomatis:** className memuat pola padding, pola rounded, dan pola shadow; `line-through` ada saat `selesai=true` dan tidak ada saat `selesai=false`; teks muncul; props bertipe `{ teks: string; selesai: boolean }`.

## Level 7 — Komponen `Button` (Reusable dengan Variant)

Di `src/components/Button.tsx`, buat **`Button`** yang menerima props **`variant`** (`'primary' | 'secondary' | 'danger'`), **`children`** (konten React), dan **`onClick`** (fungsi, **opsional**). Render sebuah `<button>` yang memuat `children`, memanggil `onClick` saat diklik, dan **tampilannya (className) berbeda untuk tiap nilai `variant`** — ini komponen *reusable*: satu komponen, banyak tampilan, diatur lewat props (pakai Tailwind untuk bedakan warnanya, mis. `bg-blue-600` untuk primary).

**Dicek otomatis:** ketiga variant menghasilkan className yang berbeda satu sama lain; `children` muncul di dalam tombol; `onClick` benar-benar terpanggil saat tombol diklik; props bertipe `{ variant: 'primary' | 'secondary' | 'danger'; children: ReactNode; onClick?: () => void }`.

## Level 8 — Komponen `DaftarTugasLengkap` (Integrasi: List + Kondisional + Button)

Di `src/components/DaftarTugasLengkap.tsx`, buat **`DaftarTugasLengkap`** yang menerima props **`tugas`** (daftar `Tugas`) dan **`onHapus`** (fungsi `(id: string) => void`). Aturan:
- Kalau `tugas` kosong, render teks yang memuat **"Tidak ada tugas"**.
- Kalau tidak, render daftar tugas — tiap item disertai **satu `<Button variant="danger">` berteks "Hapus"** (manfaatkan kembali komponen `Button` dari Level 7) yang saat diklik memanggil `onHapus(id)` dengan id tugas tersebut.

**Dicek otomatis:** kondisi kosong menampilkan pesan yang benar; 3 tugas menghasilkan tepat 3 tombol "Hapus"; mengklik tombol Hapus item ke-2 memanggil `onHapus` dengan id tugas ke-2 (bukan id lain); props bertipe `{ tugas: Tugas[]; onHapus: (id: string) => void }`.

## Level 9 — Komponen `RingkasanTugas` (Kombinasi Array Method + `&&`)

Di `src/components/RingkasanTugas.tsx`, buat **`RingkasanTugas`** yang menerima props **`tugas`** (daftar `Tugas`). Render:
- **Selalu**: teks yang memuat jumlah tugas selesai dan total tugas (mis. "2 dari 5 selesai").
- **Tambahan** (pakai `&&`): teks yang memuat kata **"Selesai"** (mis. "Semua tugas selesai! 🎉") **HANYA** kalau `tugas.length` lebih dari 0 **DAN** semuanya `selesai`.

**Hati-hati**: array **kosong** bukan berarti "semua selesai" — jangan sampai pesan perayaan muncul saat `tugas` kosong (ini jebakan umum: `Array.prototype.every()` pada array kosong selalu mengembalikan `true`).

**Dicek otomatis:** hitungan selesai/total benar untuk kombinasi campuran; pesan perayaan muncul saat semua selesai (dan tugas tidak kosong); pesan perayaan **tidak muncul** saat sebagian belum selesai, maupun saat `tugas` kosong; props bertipe `{ tugas: Tugas[] }`.

## Level 10 — Komponen `AplikasiTodo` (Bonus — gabungan semua konsep)

Di `src/components/AplikasiTodo.tsx`, buat **`AplikasiTodo`** yang menerima props **`tugas`** (daftar `Tugas`) dan **`onHapus`** (fungsi `(id: string) => void`). Gabungkan `RingkasanTugas` (Level 9) dan `DaftarTugasLengkap` (Level 8) — **manfaatkan kembali** keduanya, jangan tulis ulang logikanya.

Lalu isi `## Refleksi Pertemuan 3` di README (minimal ±40 karakter): bagian mana dari conditional rendering atau Tailwind pertemuan ini yang paling mengubah cara berpikirmu dibanding menulis HTML/CSS biasa?

**Dicek otomatis:** hasil render memuat output `RingkasanTugas` maupun `DaftarTugasLengkap`; tombol Hapus dari `DaftarTugasLengkap` tetap berfungsi memanggil `onHapus`; props bertipe `{ tugas: Tugas[]; onHapus: (id: string) => void }`; section README terisi memadai.
