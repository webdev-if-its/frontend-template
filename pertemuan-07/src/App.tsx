import { AplikasiTodoApi } from './components/AplikasiTodoApi'
import { DaftarTodoRemote } from './components/DaftarTodoRemote'

function App() {
  return (
    <main>
      <h1>Demo Progres Tugas</h1>
      <p>
        Halaman ini akan berubah seiring level yang kamu selesaikan (butuh koneksi internet untuk
        memanggil JSONPlaceholder). Jalankan <code>npm run levels</code> untuk cek progres formal.
      </p>

      <h2>Level 6–7 — DaftarTodoRemote</h2>
      <DaftarTodoRemote />

      <h2>Level 8–10 — AplikasiTodoApi</h2>
      <AplikasiTodoApi />
    </main>
  )
}

export default App
