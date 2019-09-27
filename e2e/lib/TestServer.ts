import * as http from 'http';
import * as net from 'net'
import express from 'express';

type HandlerFunc = (req: express.Request, res: express.Response) => void;

export default class TestServer {
  private http?: http.Server;

  private app: express.Application;

  constructor(
    private port = 0,
    private address = '127.0.0.1',
  ){
    this.app = express();
  }

  handle(path: string, f: HandlerFunc): TestServer {
    this.app.get(path, f);
    return this;
  }

  receiveContent(path: string, content: string): TestServer {
    this.app.get(path, (_req: express.Request, res: express.Response) => {
      res.status(200).send(content)
    });
    return this;
  }
  
  url(path: string = '/'): string {
    if (!this.http) {
      throw new Error('http server not started');
    }

    let addr = this.http.address() as net.AddressInfo;
    return `http://${addr.address}:${addr.port}${path}`
  }

  listen() {
    this.http = http.createServer(this.app)
    this.http.listen(this.port, this.address);
  }

  close(): void {
    if (!this.http) {
      return;
    }
    this.http.close();
    this.http = undefined;
  }
}
