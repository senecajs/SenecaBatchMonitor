# Changes

## 0.1.0 2026-11-21

First entry of this change log. Earlier versions are on npm and in the git
history.

* Seneca 4: the peer dependency is `seneca` `^4.0.0` (was
  `>=3||>=4.0.0-rc2`). Seneca 3 users stay on `@seneca/batch-monitor@0.0.7`.
* The entity plugin peer is `@seneca/entity` `^29.0.0` (was
  `seneca-entity` `>=26`).
* Node.js 24 or later (`engines.node` `>=24`).
* The peer dependencies `seneca-promisify` and `@seneca/entity-util` are
  removed. Seneca 4 has promises built in (D4), and the plugin does not use
  `@seneca/entity-util`.
* The option defaults are built with the validator that Seneca passes to
  the plugin: `defaults` is now a function of `{ valid }` (B1). Seneca 4
  validates options with shape and rejects defaults built with Gubu, so
  0.0.7 stops at startup there with `plugin_gubu_shape`. The gubu import is
  removed; gubu was never a declared dependency. The options are unchanged.
* Fixed: `seneca.BatchMonitor(batch)` without a run id failed, because it
  called `seneca.Nid()`, which Seneca instances do not have. It now uses
  `seneca.util.Nid()`.
* The package no longer ships `dist/Config*` files, build output of the
  `@seneca/config` plugin that this repository started from.
* The README describes this plugin; it was copied from `@seneca/config`.
* The tests load the entity plugin by its full name (`@seneca/entity`, B14)
  and check the resolved options and a batch without a run id.
