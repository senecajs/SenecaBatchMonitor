/* Copyright © 2024 Seneca Project Contributors, MIT License. */

import Seneca from 'seneca'
// import SenecaMsgTest from 'seneca-msg-test'
// import { Maintain } from '@seneca/maintain'

import BatchMonitorDoc from '../src/BatchMonitorDoc'
import BatchMonitor from '../src/BatchMonitor'


describe('BatchMonitor', () => {
  test('load-plugin', async () => {
    expect(BatchMonitorDoc).toBeDefined()
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('entity')
      .use(BatchMonitor)

    expect(seneca.BatchMonitor).toBeDefined()

    await seneca.ready()
  })


  test('BatchMonitor-basic', async () => {
    const seneca = makeSeneca({
      kind: {
        episode: {
          field: 'episode_id',
          steps: [
            { field: 'ingest', },
            { field: 'extract', },
            { field: 'audio', },
            { field: 'transcribe', },
            { field: 'chunk', },
          ]
        }
      }
    })

    const batch = seneca.BatchMonitor('b0', 'r0')

    await batch.entry('episode', 'e0', 'ingest', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'e1', 'ingest', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'e2', 'ingest', 'start', { podcast_id: 'p0' })
    await wait()

    // const bel = await seneca.entity('sys/batch').list$()
    // console.log(bel)

    const report = await batch.report('episode', { podcast_id: 'p0' })
    console.log(report.format())

    // const entry = batch.entry('episode','ingest','start')
    // entry.end()
  })


  test('BatchMonitor-multistep', async () => {
    const seneca = makeSeneca({
      kind: {
        episode: {
          field: 'episode_id',
          steps: [
            { field: 'ingest', },
            { field: 'extract', },
            { field: 'audio', },
            { field: 'transcribe', },
            { field: 'chunk', },
          ]
        }
      }
    })

    const batch = seneca.BatchMonitor('b0', 'r0')

    await batch.entry('episode', 'e0', 'ingest', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'e1', 'ingest', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'e2', 'ingest', 'start', { podcast_id: 'p0' })
    await wait()


    await batch.entry('episode', 'e0', 'ingest', 'done', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'e0', 'extract', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'e0', 'audio', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'e0', 'transcribe', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'e0', 'chunk', 'start', { podcast_id: 'p0' })
    await wait()


    // const bel = await seneca.entity('sys/batch').list$()
    // console.log(bel)

    const report = await batch.report('episode', { podcast_id: 'p0' })
    console.log(report.format())

    // const entry = batch.entry('episode','ingest','start')
    // entry.end()
  })


})


async function wait(t: number = 11) {
  return new Promise((r) => setTimeout(r, t))
}


function makeSeneca(opts: any = {}) {
  const seneca = Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use(BatchMonitor, opts)
  return seneca
}
