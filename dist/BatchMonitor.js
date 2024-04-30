"use strict";
/* Copyright © 2022 Seneca Project Contributors, MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
const table_1 = require("table");
const BatchMonitorIntern_1 = require("./BatchMonitorIntern");
function BatchMonitor(options) {
    const seneca = this;
    // const { Default } = seneca.valid
    seneca
        .fix('sys:batch');
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
function preload(plugin) {
    const seneca = this;
    const options = plugin.options;
    seneca.decorate('BatchMonitor', function (batch, run) {
        const seneca = this;
        return {
            entry: async (kind, line_id, step, state, info, err) => {
                const start = Date.now();
                const lineField = options.kind[kind].field;
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
                };
                await seneca.entity('sys/batch').save$(data);
            },
            report: async (kind, query) => {
                const entries = await seneca.entity('sys/batch').list$({
                    ...query,
                    kind,
                });
                const lineField = options.kind[kind].field;
                const steps = options.kind[kind].steps;
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
                };
                for (let i = 0; i < entries.length; i++) {
                    let entry = entries[i];
                    (0, BatchMonitorIntern_1.updateTable)(td, entry);
                }
                return {
                    format: () => {
                        const rows = (0, BatchMonitorIntern_1.rowify)(td, { start: 0 });
                        return (0, table_1.table)(rows);
                    }
                };
            }
        };
    });
}
// Default options.
const defaults = {
    // TODO: Enable debug logging
    debug: false,
    kind: {},
};
Object.assign(BatchMonitor, { defaults, preload });
exports.default = BatchMonitor;
if ('undefined' !== typeof module) {
    module.exports = BatchMonitor;
}
//# sourceMappingURL=BatchMonitor.js.map