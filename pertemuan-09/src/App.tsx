import { LabelTema } from './components/LabelTema'
import { ProfilPengguna } from './components/ProfilPengguna'
import { TombolTema } from './components/TombolTema'
import { TemaProvider } from './context/TemaContext'
import { useCounter } from './hooks/useCounter'
import { useToggle } from './hooks/useToggle'

function DemoHook() {
  const { count, increment, decrement, reset } = useCounter(5)
  const { nilai, toggle } = useToggle()
  return (
    <div>
      <p>useCounter: {String(count)}</p>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
      <p>useToggle: {String(nilai)}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  )
}

function App() {
  return (
    <TemaProvider>
      <main>
        <h1>Demo Progres Tugas</h1>
        <p>
          Halaman ini akan berubah seiring level yang kamu selesaikan (butuh internet untuk
          ProfilPengguna). Jalankan <code>npm run levels</code> untuk cek progres formal.
        </p>

        <h2>Level 1–3 — useCounter & useToggle</h2>
        <DemoHook />

        <h2>Level 7–9 — Context Tema</h2>
        <TombolTema />
        <LabelTema />

        <h2>Level 4–6 & 10 — useFetch di ProfilPengguna</h2>
        <ProfilPengguna />
      </main>
    </TemaProvider>
  )
}

export default App
