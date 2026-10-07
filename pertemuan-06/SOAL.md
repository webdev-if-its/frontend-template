# Pertemuan 6 — useEffect & Cleanup

Tugas ini melatih **side effect di React lewat `useEffect`**: mengubah judul tab, menjalankan timer (`setInterval`/`setTimeout`), memasang event listener, dan menyimpan state ke `localStorage` — lengkap dengan **dependency array** dan **cleanup function**. **Soal ini sengaja tidak menunjukkan kode jadi** — tiap level hanya menjelaskan *kontrak* komponennya (nama, props, perilaku yang diharapkan). Bagaimana cara menulisnya adalah bagian yang harus kalian pikirkan dan coba sendiri.

Karena project ini TypeScript, **tiap level dicek dua arah**: perilaku (lewat React Testing Library) **dan** tipe (props-nya benar-benar bertipe tepat, bukan `any` — lewat fitur typecheck Vitest). Kalau kalian ganti tipe props jadi `any` supaya "aman", test tipe level itu akan tetap gagal walau perilakunya kelihatan benar.

**Cara test-nya "bermain" dengan waktu:** semua timer dites memakai **jam palsu** (`vi.useFakeTimers`) — test tidak menunggu detik sungguhan, tapi bisa "memajukan" waktu seenaknya. Beberapa level dirender di dalam **`<StrictMode>`** (seperti `main.tsx` kalian), jadi efek yang lupa cleanup-nya langsung ketahuan: timer/listener-nya akan menumpuk dan jumlahnya tidak cocok dengan yang diharapkan.

Nilai mengikuti **level tertinggi yang lolos test secara berurutan** (kalau Level 3 gagal, Level 8 tidak dihitung meski lolos) — kerjakan sejauh kemampuan. Kalian **boleh mengerjakan tidak berurutan** — `npm run levels` tetap menunjukkan level mana saja yang benar-benar lolos apa adanya.

## Cara Kerja Folder Ini

```bash
cd pertemuan-06
npm install       # sekali di awal
npm run dev       # lihat progresmu di browser (perhatikan juga judul tab browser!)
npm run levels    # cek level mana yang sudah lolos
npm run build     # pastikan project tetap bisa di-build
```

Semua level akan **gagal** di awal — itu normal, kalian belum mengedit apa-apa. File di `src/__tests__/` (`levels.test.tsx` dan `levels.test-d.ts`) **jangan diedit** — dosen menimpa ulang keduanya sebelum menilai.

Level 10 juga butuh isian di **`README.md` milik repo kalian sendiri** (bukan file di folder ini) — heading `## Refleksi Pertemuan 6` sudah disiapkan di sana.

Contoh-contoh di tugas ini **sengaja tanpa `fetch`** — mengambil data dari API baru dibahas di Pertemuan 9. Semua komponen ada di `src/components/`.

---

## Level 1 — Komponen `JudulHalaman` (Efek Pertama)

Di `src/components/JudulHalaman.tsx`, buat **`JudulHalaman`** yang menerima props **`judul`** (teks). Render sebuah **`<h1>`** berisi `judul`, **dan** ubah judul tab browser (`document.title`) menjadi `judul` itu. Mengubah `document.title` adalah *side effect* — taruh di dalam **`useEffect`** (bukan di badan komponen), dan pastikan judul tab ikut berubah saat prop `judul` berubah.

**Dicek otomatis:** setelah render, `document.title` sama dengan `judul` dan `<h1>`-nya muncul; setelah prop `judul` diganti, `document.title` ikut berganti; berkas komponen memakai `useEffect(`; props bertipe `{ judul: string }`.

## Level 2 — Komponen `SapaNama` (Dependency Array)

Di `src/components/SapaNama.tsx`, buat **`SapaNama`** — komponen **tanpa props** dengan dua state: `nama` (teks) dan jumlah klik (angka). Render:
- input **berlabel "Nama"** (controlled),
- tombol **"+1"** dan teks **`Klik: {jumlah}`**.

Pakai `useEffect` untuk mengubah `document.title` menjadi **`Halo, {nama}`** (kalau `nama` masih kosong: **`Halo, Tamu`**). Efek **hanya boleh jalan ulang saat `nama` berubah** — klik tombol "+1" **tidak boleh** memicunya. Atur dependency array-nya dengan tepat.

**Dicek otomatis:** judul awal `Halo, Tamu`; mengetik "Budi" mengubah judul jadi `Halo, Budi`; mengklik "+1" dua kali menampilkan `Klik: 2` **tanpa** penulisan ulang judul; berkas komponen memakai `useEffect(`; komponen tidak menerima props.

## Level 3 — Komponen `Detik` (`setInterval` + Cleanup)

Di `src/components/Detik.tsx`, buat **`Detik`** — komponen **tanpa props** yang menampilkan teks **`Detik: {n}`**, mulai dari `0` dan **bertambah 1 setiap 1 detik**, memakai `setInterval` di dalam `useEffect`. Wajib:
- pakai **functional update** (`setN((d) => d + 1)`, seperti di Pertemuan 4),
- ada **cleanup** (`clearInterval`) supaya timer tidak menumpuk — termasuk saat komponen dilepas (*unmount*).

**Dicek otomatis (di dalam `<StrictMode>`):** awalnya `Detik: 0`; setelah 1 detik `Detik: 1`; setelah 3 detik `Detik: 3`; **hanya ada satu timer aktif**; setelah komponen dilepas **tidak ada timer tersisa**; komponen tidak menerima props.

## Level 4 — Komponen `PesanSementara` (`setTimeout`, Reset Saat Berganti)

Di `src/components/PesanSementara.tsx`, buat **`PesanSementara`** yang menerima props **`pesan`** (teks) dan **`durasi`** (angka, milidetik). Tampilkan `pesan`, lalu **sembunyikan** (hilang dari DOM — bukan sekadar disamarkan lewat CSS) setelah `durasi` milidetik, memakai `setTimeout` di dalam `useEffect`. Kalau prop **`pesan` berganti**, pesan baru **tampil lagi** dan hitung mundurnya **mulai dari awal** (timer lama harus dibersihkan). Saat komponen dilepas, timer harus ikut dibersihkan.

**Dicek otomatis:** pesan tampil sampai tepat `durasi` ms lalu hilang; setelah hilang, mengganti `pesan` menampilkannya lagi; mengganti `pesan` di tengah jalan (600 ms dari 1000 ms) me-reset hitungan — pesan baru masih tampil 600 ms kemudian dan baru hilang setelah 1000 ms penuh; setelah komponen dilepas tidak ada timer tersisa; props bertipe `{ pesan: string; durasi: number }`.

## Level 5 — Komponen `Stopwatch` (Efek yang Bergantung pada State)

Di `src/components/Stopwatch.tsx`, buat **`Stopwatch`** — komponen **tanpa props**. Render teks **`{detik} detik`** (mulai `0`) dan **satu tombol** yang bertuliskan **"Start"** saat berhenti dan **"Stop"** saat berjalan. Selagi berjalan, `detik` bertambah tiap 1 detik. Saat di-**Stop**, timer **harus benar-benar berhenti** (tidak ada timer tersisa); **Start** lagi melanjutkan dari angka terakhir. Gunakan state `jalan` sebagai dependency efek.

**Dicek otomatis (di dalam `<StrictMode>`):** awalnya `0 detik` dan tombol "Start"; setelah Start dan 2 detik tampil `2 detik` dan tombol "Stop"; setelah Stop **tidak ada timer tersisa** dan 3 detik berikutnya angka tetap `2 detik`; Start lagi + 1 detik menghasilkan `3 detik`; komponen tidak menerima props.

## Level 6 — Komponen `LebarJendela` (Event Listener di `window`)

Di `src/components/LebarJendela.tsx`, buat **`LebarJendela`** — komponen **tanpa props** yang menampilkan **`Lebar jendela: {n}px`** (nilai awal `window.innerWidth`) dan memperbaruinya saat jendela di-*resize*, dengan memasang `window.addEventListener('resize', ...)` di dalam `useEffect`. Wajib ada **cleanup** yang memanggil `removeEventListener` dengan **fungsi handler yang SAMA persis** dengan yang dipasang (beri nama handler-nya di dalam efek — fungsi anonim baru tidak akan melepas apa pun).

**Dicek otomatis (di dalam `<StrictMode>`):** tampilan awal sesuai lebar jendela; setelah event `resize` angkanya ikut berubah; setiap handler `resize` yang dipasang **harus dilepas** dengan referensi fungsi yang sama saat komponen dilepas; komponen tidak menerima props.

## Level 7 — Komponen `TekanEsc` (Listener + Nilai Terbaru)

Di `src/components/TekanEsc.tsx`, buat **`TekanEsc`** yang menerima props **`onEsc`**: fungsi `() => void`. Pasang listener **`keydown`** di `document` di dalam `useEffect`: saat tombol **Escape** ditekan, panggil `onEsc`. Render **`<p>Tekan Esc untuk menutup</p>`**. Wajib: **cleanup** yang melepas listener, dan efek harus memakai **`onEsc` TERBARU** — kalau prop `onEsc` berganti, yang dipanggil adalah fungsi yang baru, bukan yang lama (jebakan *stale value* dari dependency array yang kurang lengkap).

**Dicek otomatis (di dalam `<StrictMode>`):** tombol selain Escape tidak memanggil `onEsc`; Escape sekali = `onEsc` terpanggil tepat sekali (listener menumpuk akan terdeteksi); setelah prop `onEsc` diganti, Escape memanggil fungsi **baru** dan **tidak** memanggil fungsi lama; setelah komponen dilepas Escape tidak memanggil apa pun; props bertipe `{ onEsc: () => void }`.

## Level 8 — Komponen `CatatanKecil` (localStorage + Lazy Initializer)

Di `src/components/CatatanKecil.tsx`, buat **`CatatanKecil`** — komponen **tanpa props**. Render `<textarea>` **berlabel "Catatan"** (controlled). Nilai awalnya dibaca dari `localStorage.getItem('catatan')` (kalau belum ada: teks kosong) lewat **lazy initializer** `useState(() => ...)` supaya `getItem` hanya dipanggil **sekali** (bukan di setiap render). Setiap teks berubah, simpan ke `localStorage.setItem('catatan', teks)` **di dalam `useEffect`**.

**Dicek otomatis:** nilai awal diambil dari `localStorage` yang sudah terisi; setelah 3 kali mengetik, **`getItem` terpanggil tepat 1 kali** dan `localStorage` berisi teks terakhir; dipasang ulang (setelah dilepas) teks terakhir muncul lagi; berkas komponen menyimpan lewat `useEffect(`; komponen tidak menerima props.

## Level 9 — Komponen `Countdown` (Berhenti di Nol)

Di `src/components/Countdown.tsx`, buat **`Countdown`** yang menerima props **`detikAwal`** (angka) dan **`onSelesai`** (fungsi `() => void`). Tampilkan **`Sisa: {n}`** yang mulai dari `detikAwal` dan berkurang 1 tiap detik. Saat mencapai `0`: panggil **`onSelesai` tepat sekali**, **berhenti di 0** (tidak boleh negatif), dan **tidak ada timer tersisa**. Kalau komponen dilepas di tengah jalan, timer harus dibersihkan dan `onSelesai` **tidak boleh** terpanggil.

> Petunjuk: tidak semua hal perlu state tambahan — "apakah timer masih perlu jalan?" bisa dihitung langsung dari `sisa` saat render.

**Dicek otomatis:** `Sisa: 3` → `Sisa: 2` setelah 1 detik → `Sisa: 0` setelah 3 detik dengan `onSelesai` terpanggil 1 kali; 5 detik berikutnya tetap `Sisa: 0`, `onSelesai` tetap 1 kali, tidak ada timer tersisa; dilepas di detik ke-2 dari 5: tidak ada timer tersisa dan `onSelesai` tidak pernah terpanggil; props bertipe `{ detikAwal: number; onSelesai: () => void }`.

## Level 10 — Komponen `TimerBelajar` (Bonus — gabungan semua materi)

Di `src/components/TimerBelajar.tsx`, buat **`TimerBelajar`** yang menerima props **`detikAwal`** (angka). Gabungkan semua materi pertemuan ini:
- teks **`Sisa: {n} detik`** (mulai dari `detikAwal`), tombol **"Mulai"/"Jeda"** (bergantian) dan tombol **"Reset"**;
- saat berjalan, sisa berkurang tiap detik; **"Jeda"** menghentikan timer (tidak ada timer tersisa); **"Reset"** mengembalikan sisa ke `detikAwal` **dan berhenti**;
- saat sisa mencapai `0`: tampil teks **`Selesai!`**, timer berhenti otomatis, dan tombol "Mulai" **dinonaktifkan** (`disabled`);
- **judul tab** (`document.title`) selalu **`Sisa: {n} detik`** selama komponen terpasang, dan **kembali ke judul semula saat komponen dilepas** (cleanup yang mengembalikan nilai lama).

Lalu isi `## Refleksi Pertemuan 6` di README (minimal ±40 karakter): kenapa efek yang memasang timer atau listener **wajib** punya cleanup, dan apa yang terjadi kalau cleanup-nya dilupakan? Kaitkan juga dengan kenapa `console.log` di efek muncul dua kali saat development (`StrictMode`).

**Dicek otomatis (di dalam `<StrictMode>`):** `Sisa: 3 detik` dan judul tab sesuai; sebelum Mulai tidak ada timer; setelah Mulai + 1 detik `Sisa: 2 detik` dan judul tab ikut berubah; Jeda menghentikan timer (tidak ada timer tersisa) dan waktu tidak berjalan; Reset kembali ke `Sisa: 3 detik` dan berhenti; Mulai + 3 detik menampilkan `Sisa: 0 detik`, `Selesai!`, tombol "Mulai" disabled, dan tidak ada timer tersisa; setelah komponen dilepas, **judul tab kembali** ke judul sebelum komponen dipasang; props bertipe `{ detikAwal: number }`; section README terisi memadai.
