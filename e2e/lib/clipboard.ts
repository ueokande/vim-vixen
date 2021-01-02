import { spawn } from "child_process";

const readLinux = (): Promise<string> => {
  let stdout = "",
    stderr = "";
  return new Promise((resolve) => {
    const xsel = spawn("xsel", ["--clipboard", "--output"]);
    xsel.stdout.on("data", (data) => {
      stdout += data;
    });
    xsel.stderr.on("data", (data) => {
      stderr += data;
    });
    xsel.on("close", (code) => {
      if (code !== 0) {
        throw new Error(`xsel returns ${code}: ${stderr}`);
      }
      resolve(stdout);
    });
  });
};

const writeLinux = (data: string): Promise<void> => {
  let stderr = "";
  return new Promise((resolve) => {
    const xsel = spawn("xsel", ["--clipboard", "--input"]);
    xsel.stderr.on("data", (data) => {
      stderr += data;
    });
    xsel.on("close", (code) => {
      if (code !== 0) {
        throw new Error(`xsel returns ${code}: ${stderr}`);
      }
      resolve();
    });
    xsel.stdin.write(data);
    xsel.stdin.end();
  });
};

const readDarwin = (): Promise<string> => {
  let stdout = "",
    stderr = "";
  return new Promise((resolve) => {
    const pbpaste = spawn("pbpaste");
    pbpaste.stdout.on("data", (data) => {
      stdout += data;
    });
    pbpaste.stderr.on("data", (data) => {
      stderr += data;
    });
    pbpaste.on("close", (code) => {
      if (code !== 0) {
        throw new Error(`pbpaste returns ${code}: ${stderr}`);
      }
      resolve(stdout);
    });
  });
};

const writeDarwin = (data: string): Promise<void> => {
  let stderr = "";
  return new Promise((resolve) => {
    const pbcopy = spawn("pbcopy");
    pbcopy.stderr.on("data", (data) => {
      stderr += data;
    });
    pbcopy.on("close", (code) => {
      if (code !== 0) {
        throw new Error(`pbcopy returns ${code}: ${stderr}`);
      }
      resolve();
    });
    pbcopy.stdin.write(data);
    pbcopy.stdin.end();
  });
};

class UnsupportedError extends Error {
  constructor(platform: string) {
    super();
    this.message = `Unsupported platform: ${platform}`;
  }
}

const read = () => {
  switch (process.platform) {
    case "linux":
      return readLinux();
    case "darwin":
      return readDarwin();
  }
  throw new UnsupportedError(process.platform);
};

const write = (data: string) => {
  switch (process.platform) {
    case "linux":
      return writeLinux(data);
    case "darwin":
      return writeDarwin(data);
  }
  throw new UnsupportedError(process.platform);
};

export { read, write };
