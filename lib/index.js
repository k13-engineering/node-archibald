import dockerfiler from "node-dockerfiler";

const findFilesIgnoredByGit = async () => {
  let ignoredFiles = [];

  // for now we use a hardcoded list
  ignoredFiles = [...ignoredFiles, ".git", "node_modules", "build"];

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
