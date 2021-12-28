import archibald from "../lib/index.js";

archibald.test({
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
}).then(({ exitCode }) => {
  console.log(`Exited with ${exitCode}`);
}).catch((err) => {
  console.error(err);
});
