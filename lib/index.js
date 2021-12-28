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
    FROM ${architecture}/node:${nodeVersion}

    COPY --chown=node:node . /home/node/app
    WORKDIR /home/node/app

    USER node
    RUN npm install

    USER ${privileged ? "root" : "node"}
    ${privileged ? "RUN chown root:root /home/node -R" : ""}

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
