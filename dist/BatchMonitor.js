"use strict";
/* Copyright © 2022 Seneca Project Contributors, MIT License. */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Batch_instances, _Batch_entry;
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
        run = run || seneca.Nid();
        const bm = new Batch(seneca, options, batch, run);
        return bm;
    });
}
class Batch {
    constructor(seneca, options, batch, run) {
        _Batch_instances.add(this);
        this.start = Date.now();
        this.seneca = seneca;
        this.options = options;
        this.batch = batch;
        this.run = run;
    }
    entry(kind, step, line_id, state, info, err) {
        const self = this;
        if ('string' === typeof kind) {
            if ('string' === typeof step) {
                if ('string' === typeof line_id) {
                    if ('string' === typeof state) {
                        return __classPrivateFieldGet(self, _Batch_instances, "m", _Batch_entry).call(self, kind, step, line_id, state, info, err);
                    }
                    else {
                        return (cstate, cinfo, cerr) => self.entry(kind, step, line_id, cstate, { ...(state || {}), ...(cinfo || {}) }, cerr);
                    }
                }
                else {
                    return (cline_id, cstate, cinfo, cerr) => self.entry(kind, step, cline_id, cstate, { ...(line_id || {}), ...(cinfo || {}) }, cerr);
                }
            }
            else {
                return (cstep, cline_id, cstate, cinfo, cerr) => self.entry(kind, cstep, cline_id, cstate, { ...(step || {}), ...(cinfo || {}) }, cerr);
            }
        }
        else {
            throw new Error('BatchMonitor.entry: kind is undefined (argument 0)');
        }
    }
    async report(kind, query) {
        const entries = await this.seneca.entity('sys/batch').list$({
            ...query,
            kind,
        });
        const lineField = this.options.kind[kind].field;
        const steps = this.options.kind[kind].steps;
        const td = {
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
        };
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            (0, BatchMonitorIntern_1.updateTable)(td, entry);
        }
        return new Report(td);
    }
}
_Batch_instances = new WeakSet(), _Batch_entry = async function _Batch_entry(kind, step, line_id, state, info, err) {
    const start = Date.now();
    const lineField = this.options.kind[kind].field;
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
    };
    await this.seneca.entity('sys/batch').save$(data);
};
class Report {
    constructor(td) {
        this.td = td;
    }
    format(opts = {}) {
        var _a, _b;
        const start = (_b = (_a = opts.start) !== null && _a !== void 0 ? _a : this.td.config.start) !== null && _b !== void 0 ? _b : 0;
        const rows = (0, BatchMonitorIntern_1.rowify)(this.td, { start });
        return (0, table_1.table)(rows);
    }
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