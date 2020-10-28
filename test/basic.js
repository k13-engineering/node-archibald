/* global describe */
/* global it */

import archibald from "../lib/index.js";

import assert from "assert";
import url from "url";
import path from "path";
import stream from "stream";

const scriptPath = url.fileURLToPath(import.meta.url);
const dirnameOfScript = path.dirname(scriptPath);

const dummySink = new stream.Writable({
  write () {}
});

describe("ARCHibald", function () {
  this.timeout(120 * 1000);

  it("should execute tests without error", async () => {
    const result = await archibald.test({
      "pkg": path.resolve(dirnameOfScript, "assets", "package"),
      "architecture": "amd64",
      "nodeVersion": process.version,
      "logSink": dummySink
    });

    assert.equal(result.exitCode, 0);
  });

  it("should forward environment variables to and exit codes from runner correctly", async () => {
    const result = await archibald.test({
      "pkg": path.resolve(dirnameOfScript, "assets", "package"),
      "architecture": "amd64",
      "nodeVersion": process.version,
      "env": [
        "TEST_SHOULD_FAIL=1"
      ],
      "logSink": dummySink
    });

    assert.equal(result.exitCode, 1);
  });
});
