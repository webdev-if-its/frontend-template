import { Profil } from './components/Profil'
import { Identitas } from './components/Identitas'
import { Total } from './components/Total'
import { Kartu } from './components/Kartu'
import { Halaman } from './components/Halaman'
import { StatusPesanan } from './components/StatusPesanan'
import { Sapaan } from './components/Sapaan'
import { Panel } from './components/Panel'
import { DaftarTugas } from './components/DaftarTugas'
import { KartuInfo } from './components/KartuInfo'

function App() {
  return (
    <main>
      <h1>Demo Progres Tugas</h1>
      <p>
        Halaman ini akan berubah seiring level yang kamu selesaikan. Jalankan{' '}
        <code>npm run levels</code> untuk cek progres formal.
      </p>

      <h2>Level 1 — Profil</h2>
      <Profil nama="Budi" nrp="5025201012" />

      <h2>Level 2 — Identitas (Fragment)</h2>
      <Identitas nama="Budi" />

      <h2>Level 3 — Total</h2>
      <Total qty={3} harga={15000} />

      <h2>Level 4 — Kartu</h2>
      <Kartu judul="Kartu Aktif" aktif={true} />
      <Kartu judul="Kartu Nonaktif" aktif={false} />

      <h2>Level 5 — Halaman (komposisi)</h2>
      <Halaman judul="Beranda" />

      <h2>Level 6 — StatusPesanan</h2>
      <StatusPesanan status="pending" />
      <StatusPesanan status="selesai" />
      <StatusPesanan status="batal" />

      <h2>Level 7 — Sapaan (default props)</h2>
      <Sapaan />
      <Sapaan nama="Sari" />

      <h2>Level 8 — Panel (children)</h2>
      <Panel judul="Info">
        <p>Ini konten children yang dikirim dari App.</p>
      </Panel>

      <h2>Level 9 — DaftarTugas</h2>
      <DaftarTugas tugas={[]} />
      <DaftarTugas tugas={['Belajar JSX', 'Kerjakan tugas', 'Push ke repo']} />

      <h2>Level 10 — KartuInfo (bonus)</h2>
      <KartuInfo judul="Pengumuman">
        <p>Anak dari KartuInfo, dikirim lewat children.</p>
      </KartuInfo>
      <KartuInfo judul="Pengumuman" catatan="Dengan catatan opsional">
        <p>Anak dari KartuInfo, dikirim lewat children.</p>
      </KartuInfo>
    </main>
  )
}

export default App
