# Pertemuan 09 — Custom Hooks (`useCounter`, `useFetch`) & Context API

Tugas ini melatih **membungkus logika yang berulang menjadi custom hook** (`useCounter`, `useToggle`, dan `useFetch<T>` yang generic) serta **berbagi state ke banyak komponen tanpa props drilling lewat Context API** (`createContext`, Provider, `useContext`, dan hook pembungkus `useTema`). **Soal ini sengaja tidak menunjukkan kode jadi** — tiap level hanya menjelaskan *kontrak* hook/komponennya.

**Test tidak memanggil internet**: `fetch` di-mock oleh test. Level yang menyangkut hook dites dengan `renderHook` dari React Testing Library.

Karena project ini TypeScript, level yang menyangkut hook dan komponen **dicek dua arah**: perilaku **dan** tipe (bukan `any` — lewat fitur typecheck Vitest). Untuk `useFetch`, tipe **generic**-nya harus benar: `useFetch<User>(url)` harus menghasilkan `data: User | null`. Kalau kalian ganti tipe jadi `any` supaya "aman", test tipe level itu akan tetap gagal.

Nilai mengikuti **level tertinggi yang lolos test secara berurutan** (kalau Level 3 gagal, Level 8 tidak dihitung meski lolos) — kerjakan sejauh kemampuan. Kalian **boleh mengerjakan tidak berurutan** — `npm run levels` tetap menunjukkan level mana saja yang benar-benar lolos apa adanya.

## Cara Kerja Folder Ini

```bash
cd pertemuan-09
npm install       # sekali di awal
npm run dev       # lihat progresmu di browser (ProfilPengguna butuh internet)
npm run levels    # cek level mana yang sudah lolos
npm run build     # pastikan project tetap bisa di-build
```

Semua level akan **gagal** di awal — itu normal, kalian belum mengedit apa-apa. File di `src/__tests__/` (`levels.test.tsx` dan `levels.test-d.ts`) **jangan diedit** — dosen menimpa ulang keduanya sebelum menilai.

Level 09 juga butuh isian di **`README.md` milik repo kalian sendiri** (bukan file di folder ini) — heading `## Refleksi Pertemuan 09` sudah disiapkan di sana.

Tipe `Tema = 'terang' | 'gelap'` dan `User = { id: number; name: string; email: string }` sudah tersedia di `src/types.ts`.

---

## Level 1 — Hook `useCounter`

Di `src/hooks/useCounter.ts`, buat **`useCounter(initial: number = 0)`** yang mengembalikan object **`{ count, increment, decrement, reset }`**: `count` (angka, mulai dari `initial`), `increment()` (+1), `decrement()` (−1), dan `reset()`.

**Dicek otomatis (lewat `renderHook`):** tanpa argumen, `count` mulai dari 0; dua kali `increment`, satu kali `decrement`, lalu `reset` menghasilkan 2 → 1 → 0; tipe persis `(initial?: number) => { count: number; increment: () => void; decrement: () => void; reset: () => void }`.

## Level 2 — `useCounter`: Nilai Awal & State Terpisah

Lengkapi `useCounter`: **`reset()` harus kembali ke nilai `initial`** (bukan selalu 0), dan **tiap pemanggilan hook punya state sendiri** — hook berbagi *logika*, bukan *state*.

**Dicek otomatis:** `useCounter(10)` mulai dari 10, `increment` → 11, `reset` → 10; dua pemanggilan `useCounter(1)` terpisah tidak saling memengaruhi.

## Level 3 — Hook `useToggle` (Buatan Sendiri)

Di `src/hooks/useToggle.ts`, buat **`useToggle(awal: boolean = false)`** yang mengembalikan **`{ nilai, toggle, setTrue, setFalse }`**: `nilai` (boolean, mulai dari `awal`), `toggle()` (membalik), `setTrue()` (jadi `true`), `setFalse()` (jadi `false`; memanggil `setTrue()` dua kali tetap `true`).

**Dicek otomatis:** urutan `toggle`, `toggle`, `setTrue`, `setTrue`, `setFalse` menghasilkan nilai yang benar di tiap langkah; `useToggle(true)` mulai dari `true`; tipe persis `(awal?: boolean) => { nilai: boolean; toggle: () => void; setTrue: () => void; setFalse: () => void }`.

## Level 4 — Hook `useFetch<T>` (Loading & Data)

Di `src/hooks/useFetch.ts`, buat hook **generic `useFetch<T>(url: string)`** yang mengembalikan **`{ data, loading, error }`**:
- `data`: `T | null` — `null` sampai fetch selesai;
- `loading`: `boolean` — `true` sejak awal, `false` setelah selesai;
- `error`: `string | null` — `null` kalau tidak ada error.

Pakai `useState` + `useEffect` dan ambil data dengan `fetch(url)` lalu `res.json()`.

**Dicek otomatis:** awalnya `loading: true`, `data: null`, `error: null`; setelah respons datang `data` berisi hasil dan `loading: false`; `fetch` dipanggil tepat sekali dengan url yang diberikan; tipe generic tepat (`useFetch<User[]>(url)` → `data: User[] | null`, dst.).

## Level 5 — `useFetch`: State Error

Tangani kegagalan: kalau **`res.ok` bernilai `false`**, isi `error` dengan pesan yang memuat kata **"gagal"** (mis. `"Gagal mengambil data"`); kalau **`fetch` ditolak** (mis. jaringan putus), isi `error` dengan **`err.message`**. Dalam kedua kasus `loading` menjadi `false` dan `data` tetap `null`.

**Dicek otomatis:** respons `ok: false` menghasilkan `error` yang cocok `/gagal/i`; `fetch` yang ditolak dengan pesan "Jaringan putus" menghasilkan `error === "Jaringan putus"`; keduanya `loading: false` dan `data: null`.

## Level 6 — `useFetch`: Fetch Ulang saat URL Berubah

Pakai **`[url]` sebagai dependency** `useEffect`: kalau `url` berubah, hook harus **mengambil data lagi** — dengan `loading` kembali `true` (dan `error` di-reset) sampai data baru datang.

**Dicek otomatis:** setelah `rerender` dengan url baru, `loading` langsung `true`, lalu `data` berisi hasil dari url baru; `fetch` terpanggil dua kali, yang kedua dengan url baru.

## Level 7 — `TemaProvider` & `useTema` (Context API)

Di `src/context/TemaContext.tsx`, buat Context untuk tema aplikasi:
- **`TemaProvider({ children })`** — menyimpan tema di `useState<Tema>` (awal `'terang'`) dan menyediakan **`{ tema, gantiTema }`** lewat Context Provider. `gantiTema()` membalik `'terang'` ↔ `'gelap'`.
- **`useTema()`** — custom hook pembungkus `useContext` yang mengembalikan `{ tema, gantiTema }`.

**Dicek otomatis:** di dalam `TemaProvider`, `useTema()` awalnya `'terang'`, `gantiTema()` → `'gelap'`, lagi → `'terang'`; tipe: `TemaProvider` menerima `{ children: ReactNode }` dan `useTema()` mengembalikan persis `{ tema: Tema; gantiTema: () => void }` (bukan `undefined`-able).

## Level 8 — `useTema` di Luar Provider

Kalau `useTema()` dipakai **di luar `TemaProvider`**, `useContext` mengembalikan nilai default — jangan biarkan itu lolos diam-diam. **Lempar `Error`** yang pesannya menyebut **`TemaProvider`** (mis. `"useTema harus dipakai di dalam <TemaProvider>"`). Ini juga yang membuat tipe return `useTema` bebas dari `undefined`.

**Dicek otomatis:** `renderHook(() => useTema())` tanpa Provider melempar error yang memuat "TemaProvider".

## Level 9 — `TombolTema` & `LabelTema` (Tanpa Props Drilling)

Buat dua komponen **tanpa props**:
- **`TombolTema`** (`src/components/TombolTema.tsx`) — `<button>` bertuliskan **`Tema: {tema}`** (mis. `Tema: terang`) yang saat diklik memanggil `gantiTema()`.
- **`LabelTema`** (`src/components/LabelTema.tsx`) — teks **`Tema saat ini: {tema}`**.

Keduanya mengambil data lewat `useTema()`, bukan props — jadi `LabelTema` harus **ikut berubah** saat `TombolTema` diklik walau tidak ada props yang dioper.

**Dicek otomatis:** di dalam satu `TemaProvider`, awalnya tombol `Tema: terang` dan teks `Tema saat ini: terang`; setelah klik keduanya menjadi `gelap`; kedua komponen tidak menerima props.

## Level 10 — `ProfilPengguna` (Bonus — Custom Hook + Context)

Di `src/components/ProfilPengguna.tsx`, buat **`ProfilPengguna`** — komponen **tanpa props** yang menggabungkan kedua materi:
- ambil data dengan **`useFetch<User>('https://jsonplaceholder.typicode.com/users/1')`** (impor dari `../hooks/useFetch`; **jangan** memanggil `fetch()` langsung),
- ambil tema dengan **`useTema()`**,
- elemen root-nya adalah **`<section>`** dengan className yang memuat **`bg-white`** saat tema `'terang'` atau **`bg-slate-900`** saat `'gelap'`,
- isi: **"Memuat..."** selama loading; **`Terjadi error: {pesan}`** kalau error; kalau sukses tampilkan **`name`** dan **`email`** pengguna.

Lalu isi `## Refleksi Pertemuan 09` di README (minimal ±40 karakter): kapan sebaiknya memakai Context dan kapan cukup dengan props biasa? Dan kenapa dua komponen yang sama-sama memanggil `useFetch` tetap tidak berbagi datanya?

**Dicek otomatis:** "Memuat..." lalu nama dan email tampil dan `fetch` dipanggil dengan alamat `/users/1`; className root berganti dari `bg-white` ke `bg-slate-900` setelah `TombolTema` diklik; respons gagal menampilkan "Terjadi error"; file `ProfilPengguna.tsx` mengimpor `useFetch`, memakai `useTema`, dan tidak memanggil `fetch(` langsung; komponen tidak menerima props; section README terisi memadai.
