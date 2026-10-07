import { CatatanKecil } from './components/CatatanKecil'
import { Countdown } from './components/Countdown'
import { Detik } from './components/Detik'
import { JudulHalaman } from './components/JudulHalaman'
import { LebarJendela } from './components/LebarJendela'
import { PesanSementara } from './components/PesanSementara'
import { SapaNama } from './components/SapaNama'
import { Stopwatch } from './components/Stopwatch'
import { TekanEsc } from './components/TekanEsc'
import { TimerBelajar } from './components/TimerBelajar'

function App() {
  return (
    <main>
      <h1>Demo Progres Tugas</h1>
      <p>
        Halaman ini akan berubah seiring level yang kamu selesaikan. Perhatikan juga judul tab
        browser. Jalankan <code>npm run levels</code> untuk cek progres formal.
      </p>

      <h2>Level 1 — JudulHalaman</h2>
      <JudulHalaman judul="Demo Pertemuan 6" />

      <h2>Level 2 — SapaNama</h2>
      <SapaNama />

      <h2>Level 3 — Detik</h2>
      <Detik />

      <h2>Level 4 — PesanSementara</h2>
      <PesanSementara pesan="Tersimpan! (hilang dalam 3 detik)" durasi={3000} />

      <h2>Level 5 — Stopwatch</h2>
      <Stopwatch />

      <h2>Level 6 — LebarJendela</h2>
      <LebarJendela />

      <h2>Level 7 — TekanEsc</h2>
      <TekanEsc onEsc={() => console.log('Escape ditekan')} />

      <h2>Level 8 — CatatanKecil</h2>
      <CatatanKecil />

      <h2>Level 9 — Countdown</h2>
      <Countdown detikAwal={5} onSelesai={() => console.log('countdown selesai')} />

      <h2>Level 10 — TimerBelajar</h2>
      <TimerBelajar detikAwal={10} />
    </main>
  )
}

export default App
