/* Copyright © 2022 Seneca Project Contributors, MIT License. */

import { table } from 'table'

import {
  updateTable,
  rowify,
} from './BatchMonitorIntern'


type BatchMonitorOptionsFull = {
  debug: boolean
}

export type BatchMonitorOptions = Partial<BatchMonitorOptionsFull>



function BatchMonitor(this: any, options: BatchMonitorOptionsFull) {
  const seneca: any = this

  // const { Default } = seneca.valid

  seneca
    .fix('sys:batch')
  // .message('get:val', { key: String }, msgGetVal)


  // async function msgGetVal(this: any, msg: any) {
  //   const seneca = this

  //   const key = msg.key
  //   const entry = await seneca.entity(canon).load$(key)

  //   return {
  //     ok: null != entry,
  //     key,
  //     val: entry?.val,
  //     entry: entry?.data$(false),
  //   }
  // }

}


function preload(this: any, plugin: any) {
  const seneca = this

  const options = plugin.options

  seneca.decorate('BatchMonitor', function(this: any, batch: string, run: string) {
    const seneca = this

    return {

      entry: async (
        kind: string,
        line_id: string,
        step: string,
        state: string,
        info: any,
        err: any
      ) => {
        const start = Date.now()
        const lineField = options.kind[kind].field
        const data = {
          ...info, // TODO: namespace?
          batch,
          run,
          kind,
          [lineField]: line_id,
          step,
          state,
          start,
          end: 0,
          err,
        }
        await seneca.entity('sys/batch').save$(data)
      },

      report: async (kind: string, query: any) => {
        const entries = await seneca.entity('sys/batch').list$({
          ...query,
          kind,
        })

        const lineField = options.kind[kind].field
        const steps = options.kind[kind].steps

        const td = {
          line: {},
          config: {
            field: {
              line: lineField,
            },
            line: {
              steps,
            }
          }
        }

        for (let i = 0; i < entries.length; i++) {
          let entry = entries[i]
          updateTable(td, entry)
        }


        return {
          format: () => {
            const rows = rowify(td, { start: 0 })
            return table(rows)
          }
        }
      }
    }
  })
}



// Default options.
const defaults = {
  // TODO: Enable debug logging
  debug: false,
  kind: {},
}


Object.assign(BatchMonitor, { defaults, preload })

export default BatchMonitor

if ('undefined' !== typeof module) {
  module.exports = BatchMonitor
}
