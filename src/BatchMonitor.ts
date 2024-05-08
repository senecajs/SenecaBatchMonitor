/* Copyright © 2024 Seneca Project Contributors, MIT License. */

import { Child } from 'gubu'

import { table } from 'table'

import type {
  TableDef,
  Step,
} from './types'


import {
  updateTable,
  rowify,
} from './BatchMonitorIntern'


type BatchMonitorOptionsFull = {
  debug: boolean
  kind: Record<string, {
    field: string,
    steps: Step[]
  }>
}

export type BatchMonitorOptions = Partial<BatchMonitorOptionsFull>


const SV = 1 // Schema version


function BatchMonitor(this: any, _options: BatchMonitorOptionsFull) {
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

  const options: BatchMonitorOptionsFull = plugin.options

  seneca.decorate('BatchMonitor', function(this: any, batch: string, run?: string) {
    const seneca = this

    run = run || seneca.Nid() as string
    const bm = new Batch(seneca, options, batch, run)

    return bm
  })
}




class Batch {
  start = Date.now()
  seneca: any
  options: BatchMonitorOptionsFull
  batch: string
  run: string

  constructor(seneca: any, options: BatchMonitorOptionsFull, batch: string, run: string) {
    this.seneca = seneca
    this.options = options
    this.batch = batch
    this.run = run
  }


  entry(
    this: Batch,
    kind: string,
    step?: string,
    line_id?: string,
    state?: string,
    info?: any,
    err?: any
  ): any {
    const self = this

    // currying
    if ('string' === typeof kind) {
      if ('string' === typeof step) {
        if ('string' === typeof line_id) {
          if ('string' === typeof state) {
            return self.#entry(kind, step, line_id, state, info, err)
          }
          else {
            return (cstate: string, cinfo?: any, cerr?: any) =>
              self.entry(kind, step, line_id, cstate,
                { ...(state || {}), ...(cinfo || {}) }, cerr)
          }
        }
        else {
          return (cline_id: string, cstate?: string, cinfo?: any, cerr?: any) =>
            self.entry(kind, step, cline_id, cstate,
              { ...(line_id || {}), ...(cinfo || {}) }, cerr)
        }
      }
      else {
        return (cstep: string, cline_id?: string, cstate?: string, cinfo?: any, cerr?: any) =>
          self.entry(kind, cstep, cline_id, cstate,
            { ...(step || {}), ...(cinfo || {}) }, cerr)
      }
    }
    else {
      throw new Error('BatchMonitor.entry: kind is undefined (argument 0)')
    }
  }


  async #entry(
    this: Batch,
    kind: string,
    step: string,
    line_id: string,
    state: string,
    info: any,
    err: any
  ) {
    const start = Date.now()
    const lineField = this.options.kind[kind].field

    const data = {
      ...info, // TODO: namespace?
      batch: this.batch,
      run: this.run,
      kind,
      [lineField]: line_id,
      step,
      state,
      start,
      end: 0,
      err,
      sv: SV,
    }
    await this.seneca.entity('sys/batch').save$(data)
  }

  async report(this: Batch, kind: string, query: any) {
    const entries = await this.seneca.entity('sys/batch').list$({
      ...query,
      kind,
    })

    const lineField: string = this.options.kind[kind].field
    const steps: Step[] = this.options.kind[kind].steps

    const td: TableDef = {
      line: {},
      config: {
        start: this.start,
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

    return new Report(td)
  }

}



// NOTE: multiple entries with the same state are allowed - eg. warns
class Report {
  td: TableDef

  constructor(td: TableDef) {
    this.td = td
  }

  format(opts: any = {}): string {
    const start = opts.start ?? this.td.config.start ?? 0
    const rows = rowify(this.td, { start })
    return table(rows)
  }
}



// Default options.
const defaults = {
  // TODO: Enable debug logging
  debug: false,
  kind: Child({
    field: String,
    steps: [{
      field: String,
      default: {},
    }]
  },),
}


Object.assign(BatchMonitor, { defaults, preload })

export default BatchMonitor

if ('undefined' !== typeof module) {
  module.exports = BatchMonitor
}
