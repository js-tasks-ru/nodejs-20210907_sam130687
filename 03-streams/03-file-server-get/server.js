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
    return;
  };   

  switch (req.method) {
    case 'GET':
        const stream = fs.createReadStream(filepath);
        stream.pipe(res);       
    
        stream.on('error', (error) => {
          if (error.code === 'ENOENT'){
            res.statusCode = 404;
            res.end('file not found');
          } else {
            res.statusCode = 500;;
            res.end(`something went wrong error code: ${error.code}`);
          }
        });        
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  };

  req.on('aborted', () => {
    res.statusCode = 500;
    res.end('Connect is aborted');
    stream.destroy();
  })
});

module.exports = server;

  //fs.existsSync(path)
  //stream.on('open', () => console.log('open'));
  //stream.on('close', () => console.log('close'));
 
