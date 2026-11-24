# @seneca/batch-monitor

> _Seneca BatchMonitor_ is a plugin for [Seneca](http://senecajs.org)

Batch monitor plugin for the Seneca framework.

It records the state of each step of each line of a batch run, such as
`start` or `done`, as `sys/batch` entities, and renders the progress of a run
as a table.


[![npm version](https://img.shields.io/npm/v/@seneca/batch-monitor.svg)](https://npmjs.com/package/@seneca/batch-monitor)
[![build](https://github.com/senecajs/SenecaBatchMonitor/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/SenecaBatchMonitor/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/SenecaBatchMonitor/badge.svg?branch=main)](https://coveralls.io/github/senecajs/SenecaBatchMonitor?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/SenecaBatchMonitor/badge.svg)](https://snyk.io/test/github/senecajs/SenecaBatchMonitor)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/26547/branches/846930/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=26547&bid=846930)
[![Maintainability](https://api.codeclimate.com/v1/badges/3e5e5c11a17dbfbdd894/maintainability)](https://codeclimate.com/github/senecajs/SenecaBatchMonitor/maintainability)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |

## Install

```sh
$ npm install seneca@^4 @seneca/entity @seneca/batch-monitor
```

Version 0.1 needs Seneca 4, `@seneca/entity` 29 or later, and Node.js 24 or
later. For Seneca 3, use `@seneca/batch-monitor@0.0.7`.

## Quick Example

```js
const seneca = Seneca()
  .use('@seneca/entity')
  .use('@seneca/batch-monitor', {
    kind: {
      episode: {
        field: 'episode_id',
        steps: [{ name: 'ingest' }, { name: 'transcribe' }],
      },
    },
  })

await seneca.ready()

// A batch name and an optional run id (one is generated if missing).
const batch = seneca.BatchMonitor('podcasts', 'run-1')

// kind, step, line id, state, and extra data to store with the entry.
await batch.entry('episode', 'ingest', 'e0', 'start', { podcast_id: 'p0' })
await batch.entry('episode', 'ingest', 'e0', 'done', { podcast_id: 'p0' })

// The arguments can also be given one call at a time.
const ingest = batch.entry('episode', 'ingest')
await ingest('e1', 'start')

const report = await batch.report('episode', { podcast_id: 'p0' })
console.log(report.format())
```

## More Examples

Review the [unit tests](test/BatchMonitor.test.ts) for more examples.



<!--START:options-->


## Options

* `debug` : boolean
* `kind` : object
* `init$` : boolean


<!--END:options-->

<!--START:action-list-->


## Action Patterns



<!--END:action-list-->

<!--START:action-desc-->


## Action Descriptions



<!--END:action-desc-->

## Motivation

## Support

## API

## Contributing

## Background
