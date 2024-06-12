# FOLIO minimal platform


Copyright (C) 2015-2022 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

This is the "minimal" Stripes "platform". It consists simply of an
NPM [`package.json`](https://docs.npmjs.com/files/package.json) that
specifies the versions of `@folio/stripes`, `@folio/stripes`, the shared
dependencies they rely on, and a utility for generating module
descriptors for each Stripes module.

Please see the
[quick start guide](https://github.com/folio-org/stripes-core/blob/master/doc/quick-start.md)
for more information.

The `stripes.config.js` is a configuration for a specific tenant. In
general, a platform supports multiple tenants, each of which may
include a different set of the available modules.  You can copy the
`stripes.config.js` file to be your `stripes.config.js.local`
configuration file.

## Installation

Install platform dependencies
```
$ yarn config set @folio:registry https://repository.folio.org/repository/npm-folioci/
$ yarn install
```

## Build and serve

To build and serve `platform-minimal` in isolation for development purposes, run the "start" package script.
```
$ yarn start
```

The default configuration assumes an Okapi instance is running on http://localhost:9130 with tenant "diku".  The options `--okapi` and `--tenant` can be provided to match your environment.
```
$ yarn start --okapi http://localhost:9130 --tenant diku
```

To build a `platform-minimal` bundle for production, modify `stripes.config.js` with your Okapi and tenant, then run the "build" script, passing it the name of the desired directory to place build artifacts.
```
$ yarn build ./output
```

See the [build](https://github.com/folio-org/stripes-cli/blob/master/doc/commands.md#build-command) and [serve](https://github.com/folio-org/stripes-cli/blob/master/doc/commands.md#serve-command) command reference in `stripes-cli` for a list of available options.
