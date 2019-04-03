var http = require('http');
var url = require('url');
var handlers = require('./handlers');

class MockServer {
  constructor() {
    this.handlers = [];
    this.server = undefined;
  }

  start() {
    if (this.server) {
      throw new Error('Server is already started');
    }

    let listener = (req, res) => {
      if (req.method !== 'GET') {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('not found')
        return
      }

      let u = url.parse(req.url);
      let handler = this.handlers.find(h => u.pathname == h.pathname);
      if (!handler) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('not found')
        return
      }

      handler.handler(req, res);
    }

    this.server = http.createServer(listener);
    this.server.listen();
  }

  stop() {
    if (!this.server) {
      throw new Error('Server is not started');
    }
    this.server.close();
    this.server = undefined;
  }

  port() {
    if (!this.server) {
      throw new Error('Server is not started');
    }
    return this.server.address().port
  }

  on(pathname, handler) {
    this.handlers.push({ pathname, handler });
  }
}

module.exports = MockServer
