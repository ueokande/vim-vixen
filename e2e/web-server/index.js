var http = require('http');

const content =
'<!DOCTYPE html>' +
'<html lang="en">' +
  '<body style="width:10000px; height:10000px">' +
  '</body>' +
'</html">' ;


http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(content);
}).listen(11111, '127.0.0.1');
