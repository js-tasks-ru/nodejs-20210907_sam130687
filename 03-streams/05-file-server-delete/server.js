const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  let folders = 0;
  url.pathname.split('/').forEach((element) => {
    if (element.length > 0){
      folders += 1;
    };
  });
  
  if (folders > 1) {
    res.statusCode = 400;
    res.end('Subfolders are not allowed');
  };   
  
  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, function(err){
        if (err) {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File is not exists');
          } else {
            res.statusCode = 500;;
            res.end(`something went wrong error code: ${err}`);  
          }            
        } else {
          res.statusCode = 200;
          res.end('File deleted');
        }});     
        
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
