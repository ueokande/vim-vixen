var serverUrl = require('./url');
var http = require('http');
var url = require('url');

const handleScroll = (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<!DOCTYPEhtml><html lang="en"><body style="width:10000px; height:10000px"></body></html">');
};

const handle404 = (req, res) => {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('not found')
};

http.createServer(function (req, res) {
  let u = url.parse(req.url);
  if (req.method === 'GET' && u.pathname === '/scroll') {
    handleScroll(req, res);
  } else {
    handle404(req, res);
  }

  console.log(`"${req.method} ${req.url}"`, res.statusCode)
}).listen(serverUrl.PORT, serverUrl.HOST);
