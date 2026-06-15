export async function runConcurrentPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>
): Promise<void> {
  const workerCount = Math.max(1, Math.min(items.length, Math.floor(concurrency) || 1))
  let nextIndex = 0

  const runWorker = async () => {
    while (true) {
      const index = nextIndex
      nextIndex += 1

      if (index >= items.length) return
      await worker(items[index], index)
    }
  }

  await Promise.all(Array.from({ length: workerCount }, runWorker))
}
