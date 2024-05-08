/* Copyright © 2024 Seneca Project Contributors, MIT License. */

import type {
  TableDef
} from './types'




function updateTable(tableDef: TableDef, entry: any) {
  const config = tableDef.config
  const fieldConfig = config.field
  const lineField = fieldConfig.line

  const line_id = entry[lineField]
  if (null == line_id) {
    return tableDef
  }

  const lineMap = tableDef.line
  const line = ensureLine(tableDef, lineMap, line_id)

  const step = entry.step
  if (line.step[step].start < entry.start) {
    line.step[step] = { ...line.step[step], ...entry }
  }

  return tableDef
}


function ensureLine(tableDef: TableDef, lineMap: any, line_id: string) {
  let line = lineMap[line_id]
  if (null == line) {
    line = lineMap[line_id] = { step: {} }
    let lineSteps = tableDef.config.line.steps
    for (let sI = 0; sI < lineSteps.length; sI++) {
      let step = lineSteps[sI]
      line.step[step.field] = clone(step.default || {})
      line.step[step.field].state = line.step[step.field].state || 'init'
      line.step[step.field].start = 0
      line.step[step.field].end = 0
    }
  }
  return line
}


function clone(o: any) {
  return JSON.parse(JSON.stringify(o))
}


function rowify(table: any, opts: any) {
  const start = opts.start

  const head = ['', ...table.config.line.steps.map((step: any) => step.field)]
  const rows = []

  const lineEntries = Object.entries(table.line)
  for (let i = 0; i < lineEntries.length; i++) {
    const lineEntry: any = lineEntries[i]
    rows.push([
      lineEntry[0],
      ...(table.config.line.steps.map((step: any) => {
        let s = lineEntry[1].step[step.field]
        let time = null == s.start ? '' : s.start - start
        return (null == s.state || 'init' === s.state) ? '' : (s.state + '\n' + time)
      }))
    ])
  }

  rows.sort((a: any[], b: any[]) => {
    let ac = a[1].start
    let bc = b[1].start
    return bc - ac
  })

  rows.unshift(head)

  return rows
}



export {
  updateTable,
  rowify,
}
