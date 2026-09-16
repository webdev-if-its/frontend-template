import { useState } from 'react'

import { AplikasiTodo } from './components/AplikasiTodo'
import { Button } from './components/Button'
import { DaftarBelanja } from './components/DaftarBelanja'
import { DaftarTugas } from './components/DaftarTugas'
import { DaftarTugasLengkap } from './components/DaftarTugasLengkap'
import { HasilPencarian } from './components/HasilPencarian'
import { ItemTugas } from './components/ItemTugas'
import { KartuTugas } from './components/KartuTugas'
import { LabelStatus } from './components/LabelStatus'
import { Lencana } from './components/Lencana'
import { RingkasanTugas } from './components/RingkasanTugas'
import type { Tugas } from './types'

const belanja = [
  { id: 'b1', nama: 'Roti' },
  { id: 'b2', nama: 'Susu' },
  { id: 'b3', nama: 'Telur' },
]

const tugasContoh: Tugas[] = [
  { id: 't1', teks: 'Belajar JSX', selesai: true },
  { id: 't2', teks: 'Kerjakan tugas pertemuan 3', selesai: false },
  { id: 't3', teks: 'Push ke repo', selesai: false },
]

function App() {
  const [tugas, setTugas] = useState<Tugas[]>(tugasContoh)

  function hapusTugas(id: string) {
    setTugas((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <main>
      <h1>Demo Progres Tugas</h1>
      <p>
        Halaman ini akan berubah seiring level yang kamu selesaikan. Jalankan{' '}
        <code>npm run levels</code> untuk cek progres formal.
      </p>

      <h2>Level 1 — DaftarBelanja</h2>
      <DaftarBelanja items={belanja} />

      <h2>Level 2 — ItemTugas + DaftarTugas</h2>
      <ItemTugas tugas={tugasContoh[0]} />
      <DaftarTugas tugas={tugasContoh} />

      <h2>Level 3 — HasilPencarian (if/else)</h2>
      <HasilPencarian query="" hasil={[]} />
      <HasilPencarian query="xyz" hasil={[]} />
      <HasilPencarian query="react" hasil={['React Dasar', 'React Router']} />

      <h2>Level 4 — LabelStatus (ternary)</h2>
      <LabelStatus selesai={true} />
      <LabelStatus selesai={false} />

      <h2>Level 5 — Lencana (&&)</h2>
      <Lencana prioritas={true} />
      <Lencana prioritas={false} />

      <h2>Level 6 — KartuTugas (Tailwind)</h2>
      <KartuTugas teks="Tugas belum selesai" selesai={false} />
      <KartuTugas teks="Tugas sudah selesai" selesai={true} />

      <h2>Level 7 — Button (reusable + variant)</h2>
      <Button variant="primary">Simpan</Button>{' '}
      <Button variant="secondary">Batal</Button>{' '}
      <Button variant="danger">Hapus</Button>

      <h2>Level 8 — DaftarTugasLengkap</h2>
      <DaftarTugasLengkap tugas={tugas} onHapus={hapusTugas} />

      <h2>Level 9 — RingkasanTugas</h2>
      <RingkasanTugas tugas={tugas} />

      <h2>Level 10 — AplikasiTodo (bonus, gabungan semua)</h2>
      <AplikasiTodo tugas={tugas} onHapus={hapusTugas} />
    </main>
  )
}

export default App
