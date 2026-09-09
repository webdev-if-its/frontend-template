# Pertemuan 2 — JSX/TSX, Function Component, Props & Children

Tugas ini melatih dasar **JSX/TSX dan komponen fungsi React**, sesuai materi pertemuan ini. **Soal ini sengaja tidak menunjukkan kode JSX jadi** — tiap level hanya menjelaskan *kontrak* komponennya (nama, props, perilaku yang diharapkan, aturan). Bagaimana cara menulis JSX-nya adalah bagian yang harus kalian pikirkan dan coba sendiri (boleh buka-buka dokumentasi resmi [react.dev](https://react.dev)).

Karena project ini TypeScript, **tiap level dicek dua arah**: perilaku (komponennya benar-benar bekerja, lewat React Testing Library) **dan** tipe (props-nya benar-benar bertipe tepat, bukan `any` — lewat fitur typecheck Vitest). Kalau kalian ganti tipe props jadi `any` supaya "aman", test tipe level itu akan tetap gagal.

Nilai mengikuti **level tertinggi yang lolos test secara berurutan** (kalau Level 3 gagal, Level 8 tidak dihitung meski lolos) — kerjakan sejauh kemampuan. Kalian **boleh mengerjakan tidak berurutan** — `npm run levels` tetap menunjukkan level mana saja yang benar-benar lolos apa adanya.

## Cara Kerja Folder Ini

```bash
cd pertemuan-02
npm install       # sekali di awal
npm run dev       # lihat progresmu di browser (App.tsx merender tiap komponen)
npm run levels    # cek level mana yang sudah lolos
npm run build     # pastikan project tetap bisa di-build
```

Semua level akan **gagal** di awal — itu normal, kalian belum mengedit apa-apa. File di `src/__tests__/` (`levels.test.tsx` dan `levels.test-d.ts`) **jangan diedit** — dosen menimpa ulang keduanya sebelum menilai.

Level 1, 6, dan 10 juga butuh isian di **`README.md` milik repo kalian sendiri** (bukan file di folder ini) — heading yang dicek sudah disiapkan di sana.

---

## Level 1 — Komponen `Profil`

Di `src/components/Profil.tsx`, buat function component **`Profil`** yang menerima props **`nama`** (teks) dan **`nrp`** (teks), lalu merender **satu elemen pembungkus** (mis. `<div>`) yang di dalamnya memuat nama dan NRP tersebut.

Lalu isi `## JSX vs TSX` di README: jelaskan dengan bahasamu sendiri (minimal ±40 karakter) apa beda file `.jsx` dan `.tsx`, dan kenapa project ini pakai `.tsx`.

**Dicek otomatis:** hasil render memuat teks nama & NRP di dalam **satu** elemen root (bukan dua elemen sejajar — coba dulu apa yang terjadi kalau kalian `return` dua elemen tanpa pembungkus, JSX/TypeScript akan menolaknya duluan sebelum sempat dites); props bertipe `{ nama: string; nrp: string }`; section README terisi memadai.

## Level 2 — Komponen `Identitas` (Fragment)

Di `src/components/Identitas.tsx`, buat **`Identitas`** yang menerima props **`nama`** (teks), lalu merender **dua elemen sejajar**: sebuah heading level 2 berisi `"Identitas: <nama>"`, dan sebuah paragraf berisi teks `"Senang bertemu denganmu!"` — **tanpa** membungkusnya dengan `<div>` tambahan.

**Dicek otomatis:** tidak ada elemen `<div>` di hasil render (artinya kalian pakai Fragment, bukan `<div>` pembungkus); heading & paragraf-nya muncul dengan teks yang benar; props bertipe `{ nama: string }`.

## Level 3 — Komponen `Total`

Di `src/components/Total.tsx`, buat **`Total`** yang menerima props **`qty`** (angka) dan **`harga`** (angka), lalu merender teks yang memuat **hasil kali** keduanya (pakai ekspresi `{ }` di JSX untuk menghitungnya — jangan hitung di luar JSX lalu hardcode).

Contoh: qty 3, harga 15000 → tampilkan angka 45000 di suatu tempat pada hasil render.

**Dicek otomatis:** hasil render memuat angka perkalian yang benar untuk dua kombinasi input berbeda; props bertipe `{ qty: number; harga: number }`.

## Level 4 — Komponen `Kartu` (Aturan JSX/TSX)

Di `src/components/Kartu.tsx`, buat **`Kartu`** yang menerima props **`judul`** (teks) dan **`aktif`** (boolean), lalu merender satu `<div>` root dengan:
- atribut `className` (bukan `class`) yang bernilai `"kartu"` saat `aktif` bernilai `false`, dan memuat kata `"aktif"` juga saat `aktif` bernilai `true`,
- atribut `style` berupa **objek** (`style={{ ... }}`) yang memberi `padding: 16`,
- judulnya ditampilkan di dalam elemen tersebut.

**Dicek otomatis:** className berubah sesuai prop `aktif`; style padding benar-benar diterapkan (16px); judul muncul di hasil render; props bertipe `{ judul: string; aktif: boolean }`.

## Level 5 — Komposisi `Header`, `Footer`, `Halaman`

Di `src/components/Halaman.tsx`, lengkapi **tiga** function component:
- **`Header`**: menerima props **`judul`** (teks), merender sebuah elemen `<header>` berisi heading level 1 dengan teks `judul`.
- **`Footer`**: **tanpa props**, merender elemen `<footer>` berisi teks bebas (mis. copyright).
- **`Halaman`**: menerima props **`judul`**, merender `<Header judul={judul} />` diikuti `<Footer />` — **manfaatkan kembali** kedua komponen di atas, jangan tulis ulang markup-nya. Gunakan Fragment, jangan tambah `<div>` pembungkus baru.

**Dicek otomatis:** hasil render `Halaman` memuat sebuah `<header>` dan sebuah `<footer>`, dengan `<header>` muncul lebih dulu di DOM daripada `<footer>`; heading di dalamnya memuat `judul` yang benar; props `Header`/`Halaman` bertipe `{ judul: string }`.

## Level 6 — Komponen `StatusPesanan` (Union Type)

Di `src/types.ts`, lengkapi:
```ts
export type Status = /* union 3 nilai: 'pending' | 'selesai' | 'batal' */
```

Lalu di `src/components/StatusPesanan.tsx`, buat **`StatusPesanan`** yang menerima props **`status`** bertipe `Status` (impor dari `../types`, jangan tulis ulang uniontnya), lalu merender teks berbeda: `pending` → memuat kata **"Menunggu"**, `selesai` → memuat kata **"Selesai"**, `batal` → memuat kata **"Dibatalkan"**.

Lalu isi `## Kenapa Union Type untuk Status` di README (minimal ±40 karakter): kenapa union type di sini lebih baik dibanding memakai teks bebas (`string`) untuk status?

**Dicek otomatis:** ketiga status merender teks yang benar; `Status` persis union 3 nilai tersebut (bukan `string` biasa, bukan `any`); props `StatusPesanan` bertipe `{ status: Status }`; section README terisi memadai.

## Level 7 — Komponen `Sapaan` (Default Props)

Di `src/components/Sapaan.tsx`, buat **`Sapaan`** yang menerima props **`nama`** (teks, **opsional**). Kalau `nama` tidak diberikan, gunakan nilai default `"Tamu"`. Render sebuah paragraf berisi `"Halo, <nama>!"`.

Cari tahu: bagaimana cara memberi nilai default pada sebuah prop opsional lewat *destructuring* parameter di JavaScript/TypeScript — ini belum pernah dicontohkan di kelas.

**Dicek otomatis:** dipanggil tanpa `nama` → sapaan memuat kata "Tamu"; dipanggil dengan `nama="Sari"` → sapaan memuat kata "Sari"; props bertipe `{ nama?: string }`.

## Level 8 — Komponen `Panel` (Children Props)

Di `src/components/Panel.tsx`, buat **`Panel`** yang menerima props **`judul`** (teks) dan **`children`** (konten React apa pun — cari tahu tipe bawaan React untuk ini), lalu merender sebuah `<section>` yang memuat `judul` **dan** `children` di dalamnya.

**Dicek otomatis:** judul dan children (dikirim dari luar, isinya bisa berbeda-beda) sama-sama muncul di hasil render, dan children benar-benar berada **di dalam** elemen `Panel`; props bertipe `{ judul: string; children: ReactNode }`.

## Level 9 — Komponen `DaftarTugas` (Rendering List & `key`)

Di `src/components/DaftarTugas.tsx`, buat **`DaftarTugas`** yang menerima props **`tugas`** (daftar teks). Aturannya:
- Kalau daftarnya **kosong**, render teks yang memuat frasa **"Tidak ada tugas"**.
- Kalau **tidak kosong**, render sebuah `<ul>` berisi satu `<li>` per item — dan setiap `<li>` **wajib** diberi prop `key` yang tepat (bukan index kalau bisa dihindari, tapi minimal harus ada dan unik).

**Dicek otomatis:** daftar kosong menampilkan pesan yang benar; daftar berisi 3 item menghasilkan tepat 3 `<li>` dengan urutan & isi yang benar; **tidak ada warning React soal `key` yang hilang/salah** di console (ini yang membedakan solusi rapi dari yang asal jalan); props bertipe `{ tugas: string[] }`.

## Level 10 — Komponen `KartuInfo` (Bonus — gabungan semua konsep)

Di `src/components/KartuInfo.tsx`, buat **`KartuInfo`** yang menggabungkan beberapa konsep pertemuan ini sekaligus. Menerima props **`judul`** (teks, wajib), **`catatan`** (teks, **opsional**), dan **`children`** (konten React). Aturan:
- `judul` selalu ditampilkan.
- `catatan` **hanya** ditampilkan kalau diberikan — pastikan tidak ada teks `"undefined"` yang ikut muncul kalau `catatan` tidak diisi (pikirkan: bagaimana cara merender sesuatu secara kondisional di JSX?).
- `children` selalu ditampilkan.

Lalu isi `## Refleksi` di README (minimal ±40 karakter): bagian mana dari JSX/TSX atau konsep komponen pertemuan ini yang paling mengubah cara berpikirmu dibanding menulis HTML biasa?

**Dicek otomatis:** judul & children selalu tampil; catatan tampil hanya saat diisi (dan tidak ada teks "undefined" saat tidak diisi); props bertipe `{ judul: string; catatan?: string; children: ReactNode }`; section README terisi memadai.
