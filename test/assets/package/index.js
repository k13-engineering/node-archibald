/* eslint-disable */

import argparse from "argparse";

console.log("Hello, World!");

if (process.env.TEST_SHOULD_FAIL === "1") {
  process.exitCode = 1;
}
