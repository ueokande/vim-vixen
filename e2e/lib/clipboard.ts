import { spawn } from 'child_process';

const readLinux = (): Promise<string> => {
  let stdout = '', stderr = '';
  return new Promise((resolve) => {
    let xsel = spawn('xsel', ['--clipboard', '--output']);
    xsel.stdout.on('data', (data) => {
      stdout += data;
    });
    xsel.stderr.on('data', (data) => {
      stderr += data;
    });
    xsel.on('close', (code) => {
      if (code !== 0) {
        throw new Error(`xsel returns ${code}: ${stderr}`)
      }
      resolve(stdout);
    });
  });
};

const writeLinux = (data: string): Promise<string> => {
  let stderr = '';
  return new Promise((resolve) => {
    let xsel = spawn('xsel', ['--clipboard', '--input']);
    xsel.stderr.on('data', (data) => {
      stderr += data;
    });
    xsel.on('close', (code) => {
      if (code !== 0) {
        throw new Error(`xsel returns ${code}: ${stderr}`)
      }
      resolve();
    });
    xsel.stdin.write(data);
    xsel.stdin.end();
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
  case 'linux':
    return readLinux();
  }
  throw new UnsupportedError(process.platform);
}

const write = (data: string) => {
  switch (process.platform) {
  case 'linux':
    return writeLinux(data);
  }
  throw new UnsupportedError(process.platform);
}

export {
  read,
  write,
};
