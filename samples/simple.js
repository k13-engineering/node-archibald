import archibald from "../lib/index.js";

const { exitCode } = await archibald.test({
  "pkg": ".",
  "architecture": "amd64",
  "nodeVersion": 12
});

console.log(`Exited with ${exitCode}`);
