'use strict';

const { spawn } = require('child_process');

const readLinux = () => {
  let stdout = '', stderr = '';
  return new Promise((resolve, reject) => {
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

const writeLinux = (data) => {
  let stdout = '', stderr = '';
  return new Promise((resolve, reject) => {
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

const unsupported = (os) => {
  return () => {
    throw new Error(`Unsupported os: ${os}`);
  };
};

const detect = () => {
  switch (process.platform) {
    case 'linux':
      return {
        read: readLinux,
        write: writeLinux,
      };
    default:
      return {
        read: unsupported(process.platform),
        write: unsupported(process.platform),
      };
  }
}

module.exports = detect();
