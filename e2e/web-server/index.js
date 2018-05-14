'use strict';

var serverUrl = require('./url');
var http = require('http');
var url = require('url');

const handleScroll = (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<!DOCTYPEhtml><html lang="en"><body style="width:10000px; height:10000px"></body></html">');
};

const handleAPagenation = (req, res) => {
  let u = url.parse(req.url);
  let params = new url.URLSearchParams(u.search);
  let page = params.get('page') === null ? null : Number(params.get('page'));
  if (page === null || isNaN(page)) {
    return handle404(req, res);
  }

  let body = '';
  let nextLink = u.pathname + '?page=' + (page + 1);
  let prevLink = u.pathname + '?page=' + (page - 1);

  if (page > 1) {
    body += '<a href="' + prevLink + '">prev</a> | ';
  }
  body += '<a href="' + nextLink + '">next</a>';

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<!DOCTYPEhtml><html lang="en"><body">' + body + '</body></html">');
};

const handleLinkPagenation = (req, res) => {
  let u = url.parse(req.url);
  let params = new url.URLSearchParams(u.search);
  let page = params.get('page') === null ? null : Number(params.get('page'));
  if (page === null || isNaN(page)) {
    return handle404(req, res);
  }

  let head = '';
  let nextLink = u.pathname + '?page=' + (page + 1);
  let prevLink = u.pathname + '?page=' + (page - 1);

  if (page > 1) {
    head += '<link rel="prev" href="' + prevLink + '"></link>';
  }
  head += '<link rel="next" href="' + nextLink + '"></link>';

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<!DOCTYPEhtml><html lang="en"><head>' + head + '</head><body"></body></html">');
};

const handleFollow = (req, res) => {
  let body = '';
  body += '<a href="#a">a</a>';
  body += '<a href="#external" target="_blank">external</a>';
  body += '<img width="320" height="240"  src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" usemap="#map"><map name="map"><area href="#area" shape="rect" coords="15,19,126,104"></map>'

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<!DOCTYPEhtml><html lang="en"><body">' + body + '</body></html">');
}

const handle404 = (req, res) => {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('not found')
};

http.createServer(function (req, res) {
  if (req.method !== 'GET') {
    handle404(req, res);
  }

  let u = url.parse(req.url);
  if (u.pathname === '/scroll') {
    handleScroll(req, res);
  } else if (u.pathname === '/a-pagenation') {
    handleAPagenation(req, res);
  } else if (u.pathname === '/link-pagenation') {
    handleLinkPagenation(req, res);
  } else if (u.pathname === '/follow') {
    handleFollow(req, res);
  } else {
    handle404(req, res);
  }

  console.log(`"${req.method} ${req.url}"`, res.statusCode)
}).listen(serverUrl.PORT, serverUrl.HOST);
