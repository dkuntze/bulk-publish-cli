Bulk Publish CLI
=================

Bulk Publish CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g bulk-publish-cli
$ bpc COMMAND
running command...
$ bpc (--version)
bulk-publish/0.0.0 darwin-arm64 node-v21.3.0
$ bpc --help [COMMAND]
USAGE
  $ bpc COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bpc preview <CSV>`](#bpublish-hello-person)

## `bpc preview CSV`

Preview csv list

```
USAGE
  $ bpc preview CSV -f

ARGUMENTS
  CSV  Path to a csv file that is only paths (no header)

FLAGS
  -f, --force (optional) force update
  -w, --write (optional) write a json body file

DESCRIPTION
  Preview the list from the csv and create admin preview jobs

EXAMPLES
  $ bpc preview ./myfile.csv -f
```

_See code: [src/commands/preview/index.ts](https://github.com/dkuntze/bulk-publish-cli/blob/v0.0.0/src/commands/preview/index.ts)_

<!-- commandsstop -->
