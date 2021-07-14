# FOLIO complete platform

Copyright (C) 2015-2021 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

This is the "complete" Stripes "platform". It consists simply of an
NPM [`package.json`](https://docs.npmjs.com/files/package.json) that
specifies the version of `@folio/stripes-core` and of any Stripes
modules you wish to make available as part of this platform
to generate client bundles along with a utility for generating
module descriptors for each Stripes module.

Please see the
[quick start guide](https://github.com/folio-org/stripes-core/blob/master/doc/quick-start.md)
for more information.

The `stripes.config.js` is a configuration for a specific tenant. In
general, a platform supports multiple tenants, each of which may
include a different set of the available modules.  You can copy the
`stripes.config.js` file to be your `stripes.config.js.local`
configuration file.

The `yarn.lock` and `*-install.json` files in this repository can be
used to build a FOLIO system with the components that represent the
"Q3 2018" FOLIO release. For an example of how to deploy such a
system, see the
[Single Server Deployment Guide](https://github.com/folio-org/folio-install/blob/q3-2018/single-server.md).

## Installation

Install platform dependencies
```
$ yarn config set @folio:registry https://repository.folio.org/repository/npm-folio/
$ yarn install
```

## Build and serve

To build and serve `platform-complete` in isolation for development purposes, run the "start" package script.
```
$ yarn start
```

The default configuration assumes an Okapi instance is running on http://localhost:9130 with tenant "diku".  The options `--okapi` and `--tenant` can be provided to match your environment.
```
$ yarn start --okapi http://localhost:9130 --tenant diku
```

To build a `platform-complete` bundle for production, modify `stripes.config.js` with your Okapi and tenant, then run the "build" script, passing it the name of the desired directory to place build artifacts.
```
$ yarn build ./output
```

See the [build](https://github.com/folio-org/stripes-cli/blob/master/doc/commands.md#build-command) and [serve](https://github.com/folio-org/stripes-cli/blob/master/doc/commands.md#serve-command) command reference in `stripes-cli` for a list of available options.

## Tests

### Integration tests

Integration tests require a running Okapi.  The default configuration expects Okapi running on http://localhost:9130 with tenant "diku".  To build and run integration tests for `platform-complete` with these defaults, run the `test-int` script.
```
$ yarn test-int
```

To view tests while they are run, provide the `--show` option.
```
$ yarn test-int --show
```

To skip the build step and run integration tests against a build that is already running, provide the URL.
```
$ yarn test-int --url https://folio-testing.dev.folio.org/
```

As a convenience, `--local` can be used in place of `--url http://localhost:3000` for running tests against a development server that has already been started.
```
$ yarn test-int --local
```

### Regression tests

Regression tests for the entire platform and its apps can be run with the "test-regression" script.  This will invoke both cross-module tests defined in this platform's repository as well as all tests defined for the individual apps.

```
$ yarn test-regression --url https://folio-testing.dev.folio.org/
```

### Running specific tests

The `test-int` package script, when combined with the `--run` option, can be used for running specific tests for the platform and/or apps.  Use `WD` (working directory) when referencing platform tests, otherwise use the module app module name.

Example running "loan_renewal" test in `platform-complete`:
```
$ yarn test-int --run WD:loan_renewal
```

Example running "new_user" test in `ui-users`:
```
$ yarn test-regression --run users:new_user
```

## Build stripes using the Dockerfile
The included Dockerfile allows for building a container that serves the stripes platform using Nginx. Pass in the Okapi URL and tenant ID as build arguments. The defaults are shown below:

```
docker build -f docker/Dockerfile \
  --build-arg OKAPI_URL=http://localhost:9130 \
  --build-arg TENANT_ID=diku -t stripes .
```
The nginx server name can be passed to the container at runtime. The defualt value is `localhost` if no argument as passed. For example, to have nginx use `127.0.0.1` as the server name:
```
docker run stripes 127.0.0.1
```

## Additional information

See project [FOLIO](https://issues.folio.org/browse/FOLIO)
at the [FOLIO issue tracker](https://dev.folio.org/guidelines/issue-tracker/).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)

