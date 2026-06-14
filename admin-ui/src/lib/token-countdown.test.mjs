import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

async function loadModule() {
  const source = await readFile(new URL('./token-countdown.ts', import.meta.url), 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2020,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText

  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
}

test('formatTokenCountdown uses explicit expiresAt when available', async () => {
  const { formatTokenCountdown } = await loadModule()

  const result = formatTokenCountdown({
    expiresAt: '2026-06-15T01:30:00.000Z',
    lastUsedAt: '2026-06-15T00:00:00.000Z',
    now: new Date('2026-06-15T01:00:00.000Z'),
  })

  assert.equal(result, '30 分钟')
})

test('formatTokenCountdown falls back to lastUsedAt plus one hour', async () => {
  const { formatTokenCountdown } = await loadModule()

  const result = formatTokenCountdown({
    expiresAt: null,
    lastUsedAt: '2026-06-15T00:20:00.000Z',
    now: new Date('2026-06-15T01:00:00.000Z'),
  })

  assert.equal(result, '20 分钟')
})

test('formatTokenCountdown reports expired and unknown states', async () => {
  const { formatTokenCountdown } = await loadModule()

  assert.equal(
    formatTokenCountdown({
      expiresAt: '2026-06-15T00:59:59.000Z',
      lastUsedAt: null,
      now: new Date('2026-06-15T01:00:00.000Z'),
    }),
    '已过期'
  )

  assert.equal(
    formatTokenCountdown({
      expiresAt: null,
      lastUsedAt: null,
      now: new Date('2026-06-15T01:00:00.000Z'),
    }),
    '未知'
  )
})
