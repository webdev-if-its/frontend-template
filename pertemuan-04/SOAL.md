# Pertemuan 4 — Event Handling & useState Dasar

Tugas ini melatih **menangani event di React** (`onClick`, `onChange`, `onKeyDown`, `onSubmit`), **memberi tipe event yang tepat di TypeScript**, dan **menyimpan data yang berubah lewat `useState`** (tipe `number`, `string`, dan `boolean`). **Soal ini sengaja tidak menunjukkan kode JSX jadi** — tiap level hanya menjelaskan *kontrak* komponennya (nama, props, perilaku yang diharapkan). Bagaimana cara menulisnya adalah bagian yang harus kalian pikirkan dan coba sendiri.

Karena project ini TypeScript, **tiap level dicek dua arah**: perilaku (komponennya benar-benar bekerja saat diklik/diketik, lewat React Testing Library) **dan** tipe (props-nya benar-benar bertipe tepat, bukan `any` — lewat fitur typecheck Vitest). Kalau kalian ganti tipe props jadi `any` supaya "aman", test tipe level itu akan tetap gagal walau perilakunya kelihatan benar.

Nilai mengikuti **level tertinggi yang lolos test secara berurutan** (kalau Level 3 gagal, Level 8 tidak dihitung meski lolos) — kerjakan sejauh kemampuan. Kalian **boleh mengerjakan tidak berurutan** — `npm run levels` tetap menunjukkan level mana saja yang benar-benar lolos apa adanya.

## Cara Kerja Folder Ini

```bash
cd pertemuan-04
npm install       # sekali di awal
npm run dev       # lihat progresmu di browser (App.tsx merender tiap komponen)
npm run levels    # cek level mana yang sudah lolos
npm run build     # pastikan project tetap bisa di-build
```

Semua level akan **gagal** di awal — itu normal, kalian belum mengedit apa-apa. File di `src/__tests__/` (`levels.test.tsx` dan `levels.test-d.ts`) **jangan diedit** — dosen menimpa ulang keduanya sebelum menilai.

Level 10 juga butuh isian di **`README.md` milik repo kalian sendiri** (bukan file di folder ini) — heading `## Refleksi Pertemuan 4` sudah disiapkan di sana.

---

## Level 1 — Komponen `TombolKlik` (Mouse Event: `onClick`)

Di `src/components/TombolKlik.tsx`, buat **`TombolKlik`** yang menerima props **`onKlik`**: fungsi yang menerima event klik bertipe `React.MouseEvent<HTMLButtonElement>` dan tidak mengembalikan apa-apa. Render sebuah `<button>` bertuliskan **"Klik Saya"** yang memanggil `onKlik` (dengan event-nya) **saat diklik**.

**Dicek otomatis:** `onKlik` **tidak** terpanggil saat komponen baru dirender (hati-hati beda `onClick={f}` dan `onClick={f()}`); setelah satu klik, `onKlik` terpanggil tepat sekali dan menerima event yang `currentTarget`-nya adalah tombol; props bertipe `{ onKlik: (e: React.MouseEvent<HTMLButtonElement>) => void }`.

## Level 2 — Komponen `KotakInput` (Change Event: `onChange`)

Di `src/components/KotakInput.tsx`, buat **`KotakInput`** yang menerima props **`onUbah`**: fungsi `(nilai: string) => void`. Render sebuah `<input>` yang memanggil `onUbah` dengan **isi input terbaru tiap kali berubah** — artinya tiap ketikan satu huruf, bukan sekali di akhir.

**Dicek otomatis:** mengetik `abc` menghasilkan tepat 3 panggilan `onUbah`, berurutan dengan argumen `"a"`, `"ab"`, `"abc"`; props bertipe `{ onUbah: (nilai: string) => void }`.

## Level 3 — Komponen `KotakCari` (Keyboard Event: `onKeyDown`)

Di `src/components/KotakCari.tsx`, buat **`KotakCari`** yang menerima props **`onCari`**: fungsi `(kata: string) => void`. Render sebuah `<input>`; panggil `onCari` dengan **isi input saat itu** **hanya ketika tombol `Enter` ditekan** (pakai `onKeyDown` dan `e.key`). Mengetik huruf biasa atau menekan tombol lain **tidak boleh** memicu `onCari`.

**Dicek otomatis:** mengetik `react` lalu menekan `Escape` tidak memanggil `onCari`; menekan `Enter` memanggilnya tepat sekali dengan `"react"`; props bertipe `{ onCari: (kata: string) => void }`.

## Level 4 — Komponen `FormLogin` (Form Event: `onSubmit`)

Di `src/components/FormLogin.tsx`, buat **`FormLogin`** yang menerima props **`onLogin`**: fungsi `(email: string) => void`. Render sebuah `<form>` berisi input yang **berlabel "Email"** dan tombol submit bertuliskan **"Masuk"**. Saat form dikirim, **cegah perilaku default browser** (reload halaman) lalu panggil `onLogin` dengan isi email.

**Dicek otomatis:** mengisi email `budi@its.ac.id` lalu mengklik "Masuk" memanggil `onLogin("budi@its.ac.id")` tepat sekali; event `submit` pada `<form>` **harus dicegah** (`preventDefault()` dipanggil); props bertipe `{ onLogin: (email: string) => void }`.

## Level 5 — Komponen `Penghitung` (`useState<number>`)

Di `src/components/Penghitung.tsx`, buat **`Penghitung`** yang menerima props **`awal`** (angka, **opsional**, default `0`). Simpan angka di `useState`, tampilkan teks **`Jumlah: {angka}`**, dan sediakan tiga tombol: **"+"** (tambah 1), **"-"** (kurangi 1), dan **"Reset"** (kembali ke nilai `awal`, **bukan selalu 0**).

**Dicek otomatis:** tanpa props, mulai dari `Jumlah: 0`, tombol +/−/Reset bekerja berurutan; dengan `awal={5}` mulai dari `Jumlah: 5` dan Reset kembali ke 5; props bertipe `{ awal?: number }`.

## Level 6 — Komponen `PenghitungBatas` (State + Batas)

Di `src/components/PenghitungBatas.tsx`, buat **`PenghitungBatas`** yang menerima props **`min`** dan **`max`** (angka). Angka **dimulai dari `min`**, tampil sebagai **`Nilai: {angka}`**, dengan tombol **"+"** dan **"-"**. Tombol "+" harus **`disabled`** saat angka sudah sama dengan `max`, dan tombol "-" harus **`disabled`** saat angka sudah sama dengan `min`.

**Dicek otomatis:** dengan `min=0, max=2`: awalnya "-" disabled dan "+" aktif; setelah dua kali "+" angka 2 dan "+" disabled; klik "-" kembali ke 1 dan "+" aktif lagi; dengan `min=3` angka dimulai dari 3; props bertipe `{ min: number; max: number }`.

## Level 7 — Komponen `SapaNama` (`useState<string>` + Controlled Input)

Di `src/components/SapaNama.tsx`, buat **`SapaNama`** — komponen **tanpa props**. Render sebuah **controlled input** (nilainya diambil dari state, lewat `value` + `onChange`) yang **berlabel "Nama"**, dan sebuah teks **`Halo, {nama}!`**. Kalau nama masih kosong, tampilkan **`Halo, Tamu!`**.

**Dicek otomatis:** awalnya muncul "Halo, Tamu!"; mengetik "Budi" menghasilkan "Halo, Budi!" dan nilai input tetap "Budi"; mengosongkan input mengembalikan "Halo, Tamu!"; komponen tidak menerima props sama sekali (daftar parameter fungsi-nya kosong).

## Level 8 — Komponen `KalkulatorMini` (State Number dari Input)

Di `src/components/KalkulatorMini.tsx`, buat **`KalkulatorMini`** — komponen **tanpa props**. Render dua input angka (`type="number"`) yang **berlabel "Angka A"** dan **"Angka B"**, dan teks **`Hasil: {A + B}`**. Ingat: `e.target.value` **selalu bertipe string**, jadi ubah ke `number` sebelum dijumlahkan. Input yang kosong dianggap `0`.

**Dicek otomatis:** awalnya `Hasil: 0`; A=2 dan B=3 menghasilkan `Hasil: 5`; setelah A diganti jadi 10, hasilnya `Hasil: 13` (bukan `103` — jebakan penggabungan string); komponen tidak menerima props.

## Level 9 — Komponen `DetailToggle` (State Boolean)

Di `src/components/DetailToggle.tsx`, buat **`DetailToggle`** yang menerima props **`isi`** (teks). Gunakan state **boolean**: awalnya detail **tersembunyi** dan tombol bertuliskan **"Tampilkan detail"**. Saat diklik, teks `isi` muncul dan tombol berubah menjadi **"Sembunyikan detail"**; klik lagi menyembunyikannya kembali — elemennya harus **benar-benar hilang dari DOM**, bukan sekadar disembunyikan lewat CSS.

**Dicek otomatis:** urutan awal → klik → klik lagi menghasilkan teks/tombol yang benar di tiap langkah (termasuk pengecekan bahwa saat tersembunyi, teks `isi` tidak ada di DOM); props bertipe `{ isi: string }`.

## Level 10 — Komponen `FormPesan` (Bonus — gabungan semua konsep)

Di `src/components/FormPesan.tsx`, buat **`FormPesan`** yang menerima props **`onKirim`**: fungsi `(pesan: string) => void`. Gabungkan seluruh konsep pertemuan ini dalam satu form:
- **controlled input** yang **berlabel "Pesan"**, dan tombol submit **"Kirim"** di dalam `<form>`;
- tombol **`disabled`** kalau isi pesan (setelah di-`trim()`) **kosong**;
- saat submit: cegah reload, panggil `onKirim` dengan pesan yang **sudah di-trim**, lalu **kosongkan input**.

Lalu isi `## Refleksi Pertemuan 4` di README (minimal ±40 karakter): apa bedanya variabel biasa dengan state, dan kenapa `e.target.value` perlu diubah dulu ke `number` sebelum dihitung?

**Dicek otomatis:** tombol disabled saat kosong dan saat hanya berisi spasi; mengetik `"  Halo dunia  "` lalu submit memanggil `onKirim("Halo dunia")` tepat sekali, input kosong lagi, tombol disabled lagi; props bertipe `{ onKirim: (pesan: string) => void }`; section README terisi memadai.
