# @seneca/batch-monitor

> _Seneca BatchMonitor_ is a plugin for [Seneca](http://senecajs.org)

Live configuration plugin for the Seneca framework.

Unlike static configuration, this plugin lets you store keyed
configuration in your deployed persistent storage so that you can
change it on the live system. This is useful for things like currency
exchange rates, feature flags, A/B testing etc.


[![npm version](https://img.shields.io/npm/v/@seneca/batch-monitor.svg)](https://npmjs.com/package/@seneca/config)
[![build](https://github.com/senecajs/SenecaBatchMonitor/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/SenecaBatch-Monitor/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/SenecaBatchMonitor/badge.svg?branch=main)](https://coveralls.io/github/senecajs/SenecaBatch-Monitor?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/SenecaBatchMonitor/badge.svg)](https://snyk.io/test/github/senecajs/SenecaBatch-Monitor)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/26547/branches/846930/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=26547&bid=846930)
[![Maintainability](https://api.codeclimate.com/v1/badges/3e5e5c11a17dbfbdd894/maintainability)](https://codeclimate.com/github/senecajs/SenecaBatchMonitor/maintainability)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |

## Install

```sh
$ npm install @seneca/BatchMonitor
```

## Quick Example

```js
seneca.use('BatchMonitor', {})

const initRes = await seneca.post('sys:batch-monitor,init:val,key:a,val:1')
// === { ok: true, key: 'a', val: 1, entry: { key: 'a', val: 1 } }

const getRes = await seneca.post('sys:batch-monitor,get:val,key:a')
// === { ok: true, key: 'a', val: 1, entry: { key: 'a', val: 1 } }

const setRes = await seneca.post('sys:batch-monitor,set:val,key:a,val:2')
// === { ok: true, key: 'a', val: 1, entry: { key: 'a', val: 2 } }

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
