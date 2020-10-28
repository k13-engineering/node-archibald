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
