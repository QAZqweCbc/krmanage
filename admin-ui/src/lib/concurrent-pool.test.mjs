import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

async function loadModule() {
  const source = await readFile(new URL('./concurrent-pool.ts', import.meta.url), 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2020,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText

  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
}

test('runConcurrentPool limits concurrent work and visits every item', async () => {
  const { runConcurrentPool } = await loadModule()
  let active = 0
  let maxActive = 0
  const visited = []

  await runConcurrentPool([10, 20, 30, 40, 50], 2, async (item, index) => {
    active += 1
    maxActive = Math.max(maxActive, active)
    visited.push({ item, index })
    await new Promise(resolve => setTimeout(resolve, 5))
    active -= 1
  })

  assert.equal(maxActive, 2)
  assert.deepEqual(
    visited.sort((a, b) => a.index - b.index),
    [
      { item: 10, index: 0 },
      { item: 20, index: 1 },
      { item: 30, index: 2 },
      { item: 40, index: 3 },
      { item: 50, index: 4 },
    ],
  )
})

test('runConcurrentPool treats invalid concurrency as one worker', async () => {
  const { runConcurrentPool } = await loadModule()
  let active = 0
  let maxActive = 0

  await runConcurrentPool([1, 2, 3], 0, async () => {
    active += 1
    maxActive = Math.max(maxActive, active)
    await new Promise(resolve => setTimeout(resolve, 5))
    active -= 1
  })

  assert.equal(maxActive, 1)
})

test('runConcurrentPool propagates worker errors', async () => {
  const { runConcurrentPool } = await loadModule()

  await assert.rejects(
    () => runConcurrentPool([1, 2, 3], 2, async item => {
      if (item === 2) throw new Error('boom')
    }),
    /boom/,
  )
})
