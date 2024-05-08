/* Copyright © 2024 Seneca Project Contributors, MIT License. */

import type {
  Table,
  StepDef,
  Line,
  Step,
} from './types'



function updateTable(tableDef: Table, entry: any) {
  const config = tableDef.config
  const fieldConfig = config.field
  const lineField = fieldConfig.line

  const line_id = entry[lineField]
  if (null == line_id) {
    return tableDef
  }

  const lineMap = tableDef.line
  const line = ensureLine(tableDef, lineMap, line_id)

  const stepName = entry.step

  if (0 === line.step[stepName].start) {
    line.step[stepName] = { ...line.step[stepName], ...entry }
  }
  else {
    line.step[stepName].more.push({ ...entry })
  }

  return tableDef
}



function ensureLine(tableDef: Table, lineMap: Record<string, Line>, line_id: string): Line {
  let line = lineMap[line_id]
  if (null == line) {
    line = lineMap[line_id] = {
      step: {},
    }
    let lineSteps = tableDef.config.line.steps

    for (let sI = 0; sI < lineSteps.length; sI++) {
      const stepDef = lineSteps[sI]
      const name = stepDef.name

      const step: Step = {
        ...clone(stepDef.default || {}),
        state: 'init',
        start: 0,
        end: 0,
        more: [],
      }
      line.step[name] = step
    }
  }
  return line
}


function clone(o: any) {
  return JSON.parse(JSON.stringify(o))
}


function rowify(table: Table, opts: any) {
  const start = opts.start

  const head = ['', ...table.config.line.steps.map((step: StepDef) => step.name)]
  const rows = []

  const lineEntries: Array<[string, any]> = Object.entries(table.line)
  for (let i = 0; i < lineEntries.length; i++) {
    const lineEntry = lineEntries[i]
    rows.push([
      lineEntry[0],
      ...(table.config.line.steps.map((step: StepDef) => {
        let s = lineEntry[1].step[step.name]
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
