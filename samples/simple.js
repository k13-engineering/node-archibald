import archibald from "../lib/index.js";

archibald.test({
  "pkg": ".",
  "architecture": "amd64",
  "nodeVersion": 12
}).then(({ exitCode }) => {
  console.log(`Exited with ${exitCode}`);
}).catch((err) => {
  console.error(err);
});
