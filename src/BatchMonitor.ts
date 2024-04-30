/* Copyright © 2022 Seneca Project Contributors, MIT License. */


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


// Default options.
const defaults = {
  // TODO: Enable debug logging
  debug: false,

}


Object.assign(BatchMonitor, { defaults })

export default BatchMonitor

if ('undefined' !== typeof module) {
  module.exports = BatchMonitor
}
