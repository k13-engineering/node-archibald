#!/usr/bin/env node

import archibald from "./index.js";
import argparse from "argparse";
import prependTransform from "prepend-transform";

const NODE_MAJOR_VERSION = parseInt(process.versions.node.split(".")[0], 10);

const parseArguments = () => {
  const parser = new argparse.ArgumentParser({
    "description": "ARCHibald node test runner for different architectures and node versions"
  });
  parser.add_argument("-a", "--arch", {
    "type": String,
    "action": "append",
    "help": "test node application for ARCH (e.g. aarch64)"
  });
  parser.add_argument("-n", "--node", {
    "type": String,
    "action": "append",
    "help": "test node application for node version (e.g. 12)"
  });
  parser.add_argument("-e", "--env", {
    "type": String,
    "action": "append",
    "help": "environment variables to be passed to docker"
  });
  parser.add_argument("-p", "--privileged", {
    "action": "store_true",
    "help": "run container in privileged mode"
  });
  parser.add_argument("package", {
    "type": String,
    "help": "package directory"
  });

  const parsed = parser.parse_args();

  return {
    "pkg": parsed.package,
    "architectures": parsed.arch || ["amd64"],
    "versions": parsed.node || [NODE_MAJOR_VERSION],
    "env": parsed.env || [],
    "privileged": parsed.privileged
  };
};

const performTests = async ({ pkg, architectures, versions, env, privileged }) => {
  for (const architecture of architectures) {
    for (const nodeVersion of versions) {
      console.log("");
      console.log(`--- Testing with Node ${nodeVersion} on ${architecture} ---`);
      console.log("");

      const logSink = prependTransform.pt(`[ Node ${nodeVersion} @ ${architecture} ] `);
      logSink.pipe(process.stdout);

      const { exitCode } = await archibald.test({
        pkg,
        architecture,
        nodeVersion,
        env,
        privileged,
        logSink
      });

      if (exitCode !== 0) {
        return {
          exitCode
        };
      }
    }
  }

  return {
    "exitCode": 0
  };
};

const { pkg, architectures, versions, env, privileged } = parseArguments();
performTests({ pkg, architectures, versions, env, privileged }).then(({ exitCode }) => {
  process.exitCode = exitCode;
}).catch((err) => {
  console.error(err);
  process.exitCode = -1;
});
