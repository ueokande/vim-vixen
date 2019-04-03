const handleText = (body) => {
    return (req, res) => {
      res.writeHead(200, {'Content-Type': 'text/plane'});
      res.end(body);
    }
}

const handleHtml = (body) => {
    return (req, res) => {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(body);
    }
}

module.exports = {
  handleText, handleHtml
}
