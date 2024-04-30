"use strict";
/* Copyright © 2024 Seneca Project Contributors, MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = exports.updateTable = void 0;
function updateTable(table, entry) {
    const config = table.config;
    const fieldConfig = config.field;
    const lineField = fieldConfig.line;
    const line_id = entry.data[lineField];
    // console.log('UT-a', line_id, lineField)
    if (null == line_id) {
        return table;
    }
    const lineMap = table.line;
    const line = ensureLine(config, lineMap, line_id);
    // console.log('UT-b', line_id, lineField, line)
    const step = entry.step;
    line.step[step] = { ...line.step[step], ...entry };
    return table;
}
exports.updateTable = updateTable;
function ensureLine(config, lineMap, line_id) {
    let line = lineMap[line_id];
    if (null == line) {
        line = lineMap[line_id] = { step: {} };
        let lineSteps = config.line.steps;
        for (let sI = 0; sI < lineSteps.length; sI++) {
            let step = lineSteps[sI];
            line.step[step.field] = clone(step.default);
        }
    }
    return line;
}
function clone(o) {
    return JSON.parse(JSON.stringify(o));
}
function format(table) {
    const rows = [['', ...table.config.line.steps.map((step) => step.field)]];
    const lineEntries = Object.entries(table.line);
    for (let i = 0; i < lineEntries.length; i++) {
        const lineEntry = lineEntries[i];
        rows.push([
            lineEntry[0],
            ...(table.config.line.steps.map((step) => {
                let s = lineEntry[1].step[step.field];
                return s.state;
            }))
        ]);
    }
    return rows;
}
exports.format = format;
//# sourceMappingURL=BatchMonitorIntern.js.map