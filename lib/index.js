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

    # Workaround for arm32v7 certificate issues
    RUN c_rehash

    RUN npm install -g n && n ${nodeVersion}

    RUN useradd -ms /bin/bash archibald
    USER archibald
    WORKDIR /home/archibald

    COPY --chown=archibald:archibald . /home/archibald
    RUN npm install

    USER ${privileged ? "root" : "archibald"}
    ${privileged ? "RUN chown root:root /home/archibald -R" : ""}

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
