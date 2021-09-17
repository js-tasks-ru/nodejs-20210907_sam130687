const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();
const limitNum = 1 * 1024 * 1024; //mb;

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

  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('File is exists');
  };  

  switch (req.method) {
    case 'POST':   
        const limitedStream = new LimitSizeStream({limit: limitNum});
        const outStream = fs.createWriteStream(filepath); 
        
        const deleteFile = () => {
          outStream.destroy();
          fs.unlinkSync(filepath);
        };

        limitedStream.on('error', (error) => {
          deleteFile();
          if (error.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            res.end('File bigger then 1Mb');
          } else {
            res.statusCode = 500;
            res.end(`something went wrong error code: ${error.code}`);
          }
        });

        outStream.on('error', (error) => {
          deleteFile();
          res.statusCode = 500;
          res.end('Internal server error');
        });

        outStream.on('close', () => {
          res.statusCode = 201;
          res.end('file has been saved');
        });

        res.on('close', () => {
          if (!res.finished) {
            deleteFile();
          }
        });

        req.on('error', (err) => {
          if (err.code === 'ECONNRESET') {
            deleteFile();
          }
        });
  
        req.pipe(limitedStream).pipe(outStream);   

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
