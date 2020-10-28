# node-archibald
ARCHibald node test runner for different architectures and node versions

## About

This module allows you to run Node.js tests on different architectures and Node.js versions via docker containers. It is useful if you want to build a node package with native bindings and you want to make sure it runs on multiple architectures.

## Requirements

- `Node.js >= 10` as ES6 modules are used. Transpiling for backward compatibility is not yet setup but may be added in the future.
- `Docker` - should actually work with most if not all versions

## Usage

### CLI

Run in a container on default arch and current node version:
```bash
  $ archibald .
```

Run for architectures amd64 and arm64v8, node version 10 and 12:
```bash
  $ archibald -a amd64 -a arm64v8 -n 10 -n 12 .
```


### Node.js API

#### Minimal example

```javascript
import archibald from "../lib/index.js";

const { exitCode } = await archibald.test({
  "pkg": ".",
  "architecture": "amd64",
  "nodeVersion": 12
});

console.log(`Exited with ${exitCode}`);
```

#### Advanced example

```javascript
import archibald from "../lib/index.js";

const { exitCode } = await archibald.test({
  "pkg": ".",
  "architecture": "amd64",
  "nodeVersion": 12,
  // environment variables to pass to docker container
  "env": [
    "HELLO=World"
  ],
  // run docker container in privilged mode
  "privileged": false,
  // where to write the logs
  "logSink": process.stdout
});

console.log(`Exited with ${exitCode}`);
```
