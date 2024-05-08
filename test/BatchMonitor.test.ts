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
            { name: 'ingest', },
            { name: 'extract', },
            { name: 'audio', },
            { name: 'transcribe', },
            { name: 'chunk', },
          ]
        }
      }
    })

    const batch = seneca.BatchMonitor('b0', 'r0')

    await batch.entry('episode', 'ingest', 'e0', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'ingest', 'e1', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'ingest', 'e2', 'start', { podcast_id: 'p0' })
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
            { name: 'ingest', },
            { name: 'extract', },
            { name: 'audio', },
            { name: 'transcribe', },
            { name: 'chunk', },
          ]
        }
      }
    })

    const batch = seneca.BatchMonitor('b0', 'r0')

    await batch.entry('episode', 'ingest', 'e0', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'ingest', 'e1', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'ingest', 'e2', 'start', { podcast_id: 'p0' })
    await wait()


    await batch.entry('episode', 'ingest', 'e0', 'done', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'extract', 'e0', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'audio', 'e0', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'transcribe', 'e0', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'chunk', 'e0', 'start', { podcast_id: 'p0' })
    await wait()

    await batch.entry('episode', 'ingest', 'e1', 'done', { podcast_id: 'p0' })
    await wait()


    // const bel = await seneca.entity('sys/batch').list$()
    // console.log(bel)

    const report = await batch.report('episode', { podcast_id: 'p0' })
    console.log(report.format())

    // const entry = batch.entry('episode','ingest','start')
    // entry.end()
  })


  test('BatchMonitor-curry', async () => {
    const seneca = makeSeneca({
      kind: {
        episode: {
          field: 'episode_id',
          steps: [
            { name: 'ingest', },
            { name: 'extract', },
            { name: 'audio', },
            { name: 'transcribe', },
            { name: 'chunk', },
          ]
        }
      }
    })

    const batch = seneca.BatchMonitor('b0', 'r0')
    const entry = batch.entry('episode', 'ingest', { podcast_id: 'p0' })

    await entry('e0', 'start')
    await wait()


    await entry('e1', 'start', { foo: 1 })
    await wait()

    /*
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
*/

    // const bel = await seneca.entity('sys/batch').list$()
    // console.log(bel)

    const r0 = await batch.report('episode', { podcast_id: 'p0' })
    console.log(r0.format())

    const r1 = await batch.report('episode', { podcast_id: 'p0', foo: 1 })
    console.log(r1.format())


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
