import assert from 'node:assert'
import { test } from 'node:test'
import { programmesNowNext } from '../src/epg.ts'

const now = Date.now()
const epg = {
  channels: [{ id: 1, name: 'A', manifest: '' }],
  programmes: [
    { channelId: 1, title: 'Now', start: now - 10_000, end: now + 10_000 },
    { channelId: 1, title: 'Next', start: now + 10_001, end: now + 20_000 }
  ],
  generatedAt: now
}

test('now/next selection', () => {
  const r = programmesNowNext(epg, 1)
  assert.equal(r.now?.title, 'Now')
  assert.equal(r.next?.title, 'Next')
})
