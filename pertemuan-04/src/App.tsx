import { useState } from 'react'

import { DetailToggle } from './components/DetailToggle'
import { FormLogin } from './components/FormLogin'
import { FormPesan } from './components/FormPesan'
import { KalkulatorMini } from './components/KalkulatorMini'
import { KotakCari } from './components/KotakCari'
import { KotakInput } from './components/KotakInput'
import { Penghitung } from './components/Penghitung'
import { PenghitungBatas } from './components/PenghitungBatas'
import { SapaNama } from './components/SapaNama'
import { TombolKlik } from './components/TombolKlik'

function App() {
  const [log, setLog] = useState<string[]>([])
  const catat = (pesan: string) => setLog((prev) => [pesan, ...prev].slice(0, 5))

  return (
    <main>
      <h1>Demo Progres Tugas</h1>
      <p>
        Halaman ini akan berubah seiring level yang kamu selesaikan. Jalankan{' '}
        <code>npm run levels</code> untuk cek progres formal.
      </p>

      <h2>Level 1 — TombolKlik</h2>
      <TombolKlik onKlik={() => catat('TombolKlik diklik')} />

      <h2>Level 2 — KotakInput</h2>
      <KotakInput onUbah={(nilai: string) => catat(`onUbah: ${nilai}`)} />

      <h2>Level 3 — KotakCari</h2>
      <KotakCari onCari={(kata: string) => catat(`onCari: ${kata}`)} />

      <h2>Level 4 — FormLogin</h2>
      <FormLogin onLogin={(email: string) => catat(`onLogin: ${email}`)} />

      <h2>Level 5 — Penghitung</h2>
      <Penghitung awal={3} />

      <h2>Level 6 — PenghitungBatas</h2>
      <PenghitungBatas min={0} max={5} />

      <h2>Level 7 — SapaNama</h2>
      <SapaNama />

      <h2>Level 8 — KalkulatorMini</h2>
      <KalkulatorMini />

      <h2>Level 9 — DetailToggle</h2>
      <DetailToggle isi="Ini detail rahasia." />

      <h2>Level 10 — FormPesan</h2>
      <FormPesan onKirim={(pesan: string) => catat(`onKirim: ${pesan}`)} />

      <h2>Log event (5 terakhir)</h2>
      <ul>
        {log.map((baris, i) => (
          <li key={i}>{baris}</li>
        ))}
      </ul>
    </main>
  )
}

export default App
