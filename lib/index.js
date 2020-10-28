import fs from "fs";
import path from "path";

import dockerfiler from "node-dockerfiler";
import NodeGit from "nodegit";

const isGitRepository = async ({ pkg }) => {
  try {
    const st = await fs.promises.stat(path.resolve(pkg, ".git"));
    return st.isDirectory();
  } catch (ex) {
    if (ex.code === "ENOENT") {
      return false;
    }

    throw ex;
  }
};

const findFilesIgnoredByGit = async ({ pkg }) => {
  let ignoredFiles = [];

  if (await isGitRepository({ pkg })) {
    const repo = await NodeGit.Repository.open(pkg);
    await NodeGit.Status.foreach(repo, (pathName, flags) => {
      if ((flags & NodeGit.Status.STATUS.IGNORED) > 0) {
        ignoredFiles = [...ignoredFiles, path.relative(pkg, pathName)];
      }
    });
  }

  return ignoredFiles;
};

const test = async ({
  pkg,
  architecture,
  nodeVersion,
  env,
  logSink,
  privileged = false
}) => {
  const dockerfileContent = `
    FROM ${architecture}/debian:buster

    RUN apt-get update -q -y && apt-get install -q -y git npm curl python build-essential

    RUN mkdir -p /work
    WORKDIR /work

    RUN npm install -g n && n ${nodeVersion}

    COPY . /work
    RUN npm install
    CMD npm test
  `;

  const ignoredFiles = await findFilesIgnoredByGit({ pkg });

  const result = await dockerfiler.run({
    dockerfileContent,
    "context": pkg,
    "ignore": (name) => {
      return ignoredFiles.indexOf(name) >= 0;
    },
    "options": {
      "Privileged": privileged,
      "Env": env
    },
    logSink
  });

  return {
    "exitCode": result.StatusCode
  };
};

export default {
  test
};
