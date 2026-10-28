#!/usr/bin/env node
/**
 * Jalankan lewat `npm run levels`. Menjalankan Vitest sekali, lalu
 * menampilkan level mana saja yang lulus dengan cara yang mudah dibaca -
 * setara `go test -v` + ringkasan level di course Go, versi Vitest.
 */
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const dir = mkdtempSync(join(tmpdir(), 'levels-'))
const hasilJson = join(dir, 'hasil.json')

const run = spawnSync('npx', ['vitest', 'run', '--reporter=json', '--outputFile', hasilJson], {
  stdio: ['ignore', 'ignore', 'inherit'],
  shell: true,
})

if (run.error) {
  console.error('Gagal menjalankan Vitest:', run.error.message)
  rmSync(dir, { recursive: true, force: true })
  process.exit(1)
}

let ringkasan
try {
  const laporan = JSON.parse(readFileSync(hasilJson, 'utf8'))
  ringkasan = ringkas(laporan)
} catch (err) {
  console.error('Gagal membaca hasil test:', err.message)
  ringkasan = { tertinggi: 0, levelLulus: [], total: 0, lulus: 0, rincian: [] }
}
rmSync(dir, { recursive: true, force: true })

function ringkas(laporan) {
  const level = new Map()
  for (const berkas of laporan.testResults || []) {
    for (const t of berkas.assertionResults || []) {
      const cocok = /Level\s+(\d+)/i.exec(t.title || t.fullName || '')
      if (!cocok) continue
      const n = Number(cocok[1])
      if (!level.has(n)) level.set(n, { total: 0, lulus: 0, judul: t.title || t.fullName })
      const l = level.get(n)
      l.total += 1
      if (t.status === 'passed') l.lulus += 1
    }
  }
  const nums = [...level.keys()].sort((a, b) => a - b)
  let tertinggi = 0
  let berurutan = true
  const levelLulus = []
  const rincian = []
  for (const n of nums) {
    const l = level.get(n)
    const lulus = l.lulus === l.total
    rincian.push({ n, lulus, judul: l.judul })
    if (lulus) {
      levelLulus.push(n)
      if (berurutan) tertinggi = n
    } else {
      berurutan = false
    }
  }
  const maxLevel = nums.length ? Math.max(...nums) : 0
  return { tertinggi, levelLulus, rincian, maxLevel, total: laporan.numTotalTests || 0, lulus: laporan.numPassedTests || 0 }
}

console.log('\n=== Ringkasan Level ===\n')
for (const r of ringkasan.rincian || []) {
  console.log(`  ${r.lulus ? '✓' : '✗'} ${r.judul || `Level ${r.n}`}`)
}
console.log(
  `\nLevel tertinggi (berurutan): ${ringkasan.tertinggi}/${ringkasan.maxLevel || 0}` +
    `\nLevel yang benar-benar lulus: [${ringkasan.levelLulus.join(', ')}]` +
    `\nTotal test lulus: ${ringkasan.lulus}/${ringkasan.total}\n`,
)

process.exit(run.status === 0 ? 0 : 1)
