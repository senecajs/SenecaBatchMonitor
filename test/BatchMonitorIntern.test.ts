/* Copyright © 2024 Seneca Project Contributors, MIT License. */

import { table } from 'table'

import {
  updateTable,
  format,
} from '../src/BatchMonitorIntern'


describe('BatchMonitorIntern', () => {
  test('updateTable-empty', async () => {

    const t0 = {}

    const tr0 = updateTable(t0, {})

    console.log(tr0)
  })



  test('updateTable-basic', async () => {
    const entries = shuffle(makeEntries())
    // console.log(entries)

    let t0 = {
      line: {},
      config: {
        field: {
          line: 'episode_id'
        },
        line: {
          steps: [
            { field: 'ingest', default: { state: 'init' } },
            { field: 'extract', default: { state: 'init' } },
            { field: 'audio', default: { state: 'init' } },
            { field: 'transcribe', default: { state: 'init' } },
            { field: 'chunk', default: { state: 'init' } },
          ],
        }
      }
    }

    console.log('t0-START', t0)

    for (let i = 0; i < entries.length; i++) {
      let entry = entries[i]
      updateTable(t0, entry)
    }

    console.log('t0-END')
    console.dir(t0, { depth: null })

    const f0 = format(t0)
    console.log('f0')
    console.dir(f0, { depth: null })

    console.log(table(f0))
  })

})




function makeEntries() {
  const entries = [
    {
      run: 'r0', batch: 'b0', start: 1000, end: 1010, state: 'done',
      kind: 'podcast', step: 'subscribe',
      data: {
        podcast_id: 'p0'
      },
      err: null
    },
    {
      run: 'r0', batch: 'b0', start: 1010, end: 0, state: 'start',
      kind: 'podcast', step: 'ingest',
      data: {
        podcast_id: 'p0'
      },
      err: null
    },
    {
      run: 'r0', batch: 'b0', start: 1100, end: 0, state: 'start',
      kind: 'episode', step: 'ingest',
      data: {
        podcast_id: 'p0', episode_id: 'e0',
      },
      err: null,
    },
    {
      run: 'r0', batch: 'b0', start: 1200, end: 0, state: 'start',
      kind: 'episode', step: 'ingest',
      data: {
        podcast_id: 'p0', episode_id: 'e1',
      },
      err: null,
    },
    {
      run: 'r0', batch: 'b0', start: 1300, end: 0, state: 'start',
      kind: 'episode', step: 'ingest',
      data: {
        podcast_id: 'p0', episode_id: 'e2',
      },
      err: null,
    },

    {
      run: 'r0', batch: 'b0', start: 2100, end: 0, state: 'done',
      kind: 'episode', step: 'ingest',
      data: {
        podcast_id: 'p0', episode_id: 'e0',
      },
      err: null,
    },
    {
      run: 'r0', batch: 'b0', start: 2200, end: 0, state: 'done',
      kind: 'episode', step: 'ingest',
      data: {
        podcast_id: 'p0', episode_id: 'e1',
      },
      err: null,
    },
  ]
  return entries
}


function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0
    const s = a[i]
    a[i] = a[j]
    a[j] = s
  }
  return a
}
