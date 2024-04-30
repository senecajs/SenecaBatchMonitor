/* Copyright © 2024 Seneca Project Contributors, MIT License. */


function updateTable(table: any, entry: any) {
  const config = table.config
  const fieldConfig = config.field
  const lineField = fieldConfig.line

  const line_id = entry.data[lineField]
  // console.log('UT-a', line_id, lineField)
  if (null == line_id) {
    return table
  }

  const lineMap = table.line
  const line = ensureLine(config, lineMap, line_id)
  // console.log('UT-b', line_id, lineField, line)

  const step = entry.step
  line.step[step] = { ...line.step[step], ...entry }

  return table
}


function ensureLine(config: any, lineMap: any, line_id: string) {
  let line = lineMap[line_id]
  if (null == line) {
    line = lineMap[line_id] = { step: {} }
    let lineSteps = config.line.steps
    for (let sI = 0; sI < lineSteps.length; sI++) {
      let step = lineSteps[sI]
      line.step[step.field] = clone(step.default)
    }
  }
  return line
}


function clone(o: any) {
  return JSON.parse(JSON.stringify(o))
}


function format(table: any) {
  const rows = [['', ...table.config.line.steps.map((step: any) => step.field)]]

  const lineEntries = Object.entries(table.line)
  for (let i = 0; i < lineEntries.length; i++) {
    const lineEntry: any = lineEntries[i]
    rows.push([
      lineEntry[0],
      ...(table.config.line.steps.map((step: any) => {
        let s = lineEntry[1].step[step.field]
        return s.state
      }))
    ])
  }

  return rows
}



export {
  updateTable,
  format,
}
