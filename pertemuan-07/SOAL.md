# Pertemuan 9 — REST API: Fetching, Loading/Error State, CRUD & Separation of Concerns

Tugas ini melatih **mengambil data dari REST API** (`fetch` + `useEffect`), **menampilkan state loading dan error**, **operasi CRUD lengkap** (`GET`, `POST`, `PUT`, `DELETE`), dan **memisahkan logika API dari komponen** (*separation of concerns*). API yang dipakai adalah [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos). **Soal ini sengaja tidak menunjukkan kode jadi** — tiap level hanya menjelaskan *kontrak* fungsi/komponennya.

**Test tidak memanggil internet**: `fetch` di-mock oleh test (fetch palsu yang mengembalikan data contoh). Jadi hasil `npm run levels` tidak bergantung pada koneksi kalian — tapi `npm run dev` tetap memanggil JSONPlaceholder sungguhan, jadi coba juga di browser.

Karena project ini TypeScript, level yang menyangkut fungsi dan komponen **dicek dua arah**: perilaku **dan** tipe (bukan `any` — lewat fitur typecheck Vitest). Kalau kalian ganti tipe jadi `any` supaya "aman", test tipe level itu akan tetap gagal.

Nilai mengikuti **level tertinggi yang lolos test secara berurutan** (kalau Level 3 gagal, Level 8 tidak dihitung meski lolos) — kerjakan sejauh kemampuan. Kalian **boleh mengerjakan tidak berurutan** — `npm run levels` tetap menunjukkan level mana saja yang benar-benar lolos apa adanya.

## Cara Kerja Folder Ini

```bash
cd pertemuan-09
npm install       # sekali di awal
npm run dev       # lihat progresmu di browser (butuh internet)
npm run levels    # cek level mana yang sudah lolos
npm run build     # pastikan project tetap bisa di-build
```

Semua level akan **gagal** di awal — itu normal, kalian belum mengedit apa-apa. File di `src/__tests__/` (`levels.test.tsx` dan `levels.test-d.ts`) **jangan diedit** — dosen menimpa ulang keduanya sebelum menilai.

Level 10 juga butuh isian di **`README.md` milik repo kalian sendiri** (bukan file di folder ini) — heading `## Refleksi Pertemuan 9` sudah disiapkan di sana.

Tipe `Todo = { id: number; title: string; completed: boolean; userId: number }` sudah tersedia di `src/types.ts`. Semua request dikumpulkan di **`src/api/todos.ts`** dengan alamat dasar **`https://jsonplaceholder.typicode.com/todos`**.

---

## Level 1 — `getTodos` (GET)

Di `src/api/todos.ts`, buat **`getTodos(): Promise<Todo[]>`** — mengirim `GET` ke alamat dasar di atas lalu mengembalikan hasil `res.json()`.

**Dicek otomatis:** `fetch` dipanggil tepat sekali dengan alamat persis `https://jsonplaceholder.typicode.com/todos` (method `GET`); nilai kembaliannya adalah data dari respons; tipe fungsi persis `() => Promise<Todo[]>`.

## Level 2 — `getTodos`: Menangani Respons Gagal

Ubah `getTodos` agar **melempar `Error`** (pesan memuat kata **"gagal"**, mis. `"Gagal mengambil data"`) kalau `res.ok` bernilai `false`. Ingat: `fetch` **tidak** otomatis melempar error untuk status 4xx/5xx — kalian harus memeriksanya sendiri.

**Dicek otomatis:** kalau respons `ok: false`, promise dari `getTodos()` ditolak dengan error yang pesannya memuat "gagal".

## Level 3 — `addTodo` (POST)

Di `src/api/todos.ts`, buat **`addTodo(title: string): Promise<Todo>`** — mengirim `POST` ke alamat dasar dengan header **`Content-Type: application/json`** dan body **JSON string** berisi minimal `{ title, completed: false }` (boleh ditambah `userId: 1`). Kembalikan todo hasil respons; lempar `Error` ("gagal…") kalau `res.ok` false.

**Dicek otomatis:** method `POST`, header `Content-Type` = `application/json`, body berupa **string** (`JSON.stringify`) yang bila di-parse memuat `title` dan `completed: false`; nilai kembalian = respons; respons gagal menghasilkan error; tipe persis `(title: string) => Promise<Todo>`.

## Level 4 — `updateTodo` (PUT)

Di `src/api/todos.ts`, buat **`updateTodo(id: number, completed: boolean): Promise<Todo>`** — mengirim `PUT` ke **`{alamat dasar}/{id}`** dengan header JSON dan body JSON yang memuat `completed`. Kembalikan todo hasil respons; lempar `Error` ("gagal…") kalau `res.ok` false.

**Dicek otomatis:** alamat `…/todos/1` untuk `id = 1`, method `PUT`, header JSON, body memuat `completed: true`; nilai kembalian = respons; respons gagal menghasilkan error; tipe persis `(id: number, completed: boolean) => Promise<Todo>`.

## Level 5 — `hapusTodo` (DELETE)

Di `src/api/todos.ts`, buat **`hapusTodo(id: number): Promise<void>`** — mengirim `DELETE` ke **`{alamat dasar}/{id}`** (tidak perlu body) dan tidak mengembalikan apa-apa; lempar `Error` ("gagal…") kalau `res.ok` false.

**Dicek otomatis:** alamat `…/todos/7` untuk `id = 7`, method `DELETE`; hasilnya `undefined`; respons gagal menghasilkan error; tipe persis `(id: number) => Promise<void>`.

## Level 6 — Komponen `DaftarTodoRemote` (Loading & Data)

Di `src/components/DaftarTodoRemote.tsx`, buat **`DaftarTodoRemote`** — komponen **tanpa props**. Ambil data lewat **`getTodos()`** di dalam **`useEffect`** (dependency array kosong — jalan sekali saat komponen muncul). Simpan data, loading, dan error di `useState`. Selama data belum datang tampilkan teks **"Memuat..."**; setelah sukses, tampilkan `<ul>` berisi `<li>` per todo (memuat `title`) dan **"Memuat..." harus hilang**.

**Dicek otomatis:** saat respons masih tertunda, "Memuat..." tampil; setelah respons datang, dua `<li>` dengan title yang benar tampil dan "Memuat..." hilang; komponen tidak menerima props.

## Level 7 — `DaftarTodoRemote`: State Error

Tambahkan penanganan error: kalau pengambilan data gagal (respons `ok: false` **maupun** promise yang ditolak, mis. jaringan putus), tampilkan **`Terjadi error: {pesan error}`** — dan **"Memuat..." harus hilang**. Tidak boleh ada `<li>` saat error.

**Dicek otomatis:** respons gagal menampilkan teks yang memuat "Terjadi error"; `fetch` yang ditolak dengan pesan "Jaringan putus" menampilkan `Terjadi error: Jaringan putus`; dalam kedua kasus "Memuat..." hilang dan tidak ada `<li>`.

## Level 8 — Komponen `AplikasiTodoApi` (Memuat Daftar & Menambah)

Di `src/components/AplikasiTodoApi.tsx`, buat **`AplikasiTodoApi`** — komponen **tanpa props**, tersambung ke API **lewat fungsi di `src/api/todos.ts`** (jangan memanggil `fetch` langsung di komponen). Saat pertama tampil, ambil daftar (`getTodos`) dan render sebagai `<li>`; tiap `<li>` berisi **checkbox berlabel `title`** (tercentang kalau `completed`) dan tombol **"Hapus"**. Sediakan form dengan input **berlabel "Todo baru"** dan tombol **"Tambah"**: panggil `addTodo(title)`, lalu tambahkan **todo hasil respons** ke **akhir** daftar dan kosongkan input.

**Dicek otomatis:** dua todo awal tampil dengan status centang yang benar; menambah "Belajar fetch" mengirim `POST` berbody title itu, menambah `<li>` ketiga di bawah (belum tercentang), dan mengosongkan input; komponen tidak menerima props.

## Level 9 — `AplikasiTodoApi`: Toggle (PUT) & Hapus (DELETE)

Sambungkan sisa aksi ke API:
- **klik checkbox** → panggil `updateTodo(id, !completed)`, lalu **ganti todo itu di state dengan hasil respons** (memakai `map()` — todo lain tidak berubah);
- **klik "Hapus"** → panggil `hapusTodo(id)`, lalu **buang todo itu dari state** (memakai `filter()`).

**Dicek otomatis:** mencentang todo pertama mengirim `PUT` ke `…/todos/1` berbody `completed: true` dan checkbox-nya menjadi tercentang tanpa mengubah todo lain; menghapus todo kedua mengirim `DELETE` ke `…/todos/2` dan todo itu hilang dari daftar.

## Level 10 — Separation of Concerns (Bonus)

Rapikan pembagian tanggung jawab: **komponen hanya mengurus state dan tampilan; semua detail HTTP (`fetch`, header, `JSON.stringify`) tinggal di `src/api/todos.ts`**. `DaftarTodoRemote` dan `AplikasiTodoApi` harus mengimpor fungsi dari `../api/todos`, dan **tidak boleh ada pemanggilan `fetch(` di file mana pun di `src/components/`**.

Lalu isi `## Refleksi Pertemuan 9` di README (minimal ±40 karakter): apa keuntungan memisahkan fungsi API dari komponen, dan kenapa `fetch` tidak otomatis melempar error untuk respons 404/500?

**Dicek otomatis:** tidak ada `fetch(` (di luar komentar) pada file `.tsx` mana pun di `src/components/`; kedua komponen mengimpor dari `../api/todos`; section README terisi memadai.
