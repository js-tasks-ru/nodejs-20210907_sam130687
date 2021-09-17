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

  const setErrorResponse = (res, code, message) => {
    res.statusCode = code;
    res.end(message);
  };

  let folders = 0;
  
  url.pathname.split('/').forEach((element) => {
    if (element.length > 0){
      folders += 1;
    };
  });

  if (folders > 1) {
    setErrorResponse(res, 400, 'Subfolders are not allowed');
  };   

  if (fs.existsSync(filepath)) {
    setErrorResponse(res, 409,'File is exists');
  };  

  switch (req.method) {
    case 'POST':   
        const limitedStream = new LimitSizeStream({limit: limitNum});
        const outStream = fs.createWriteStream(filepath, {flags: 'wx'}); 
        
        const deleteFile = () => {
          outStream.destroy();
          fs.unlinkSync(filepath);
        };

        limitedStream.on('error', (error) => {
          deleteFile();
          if (error.code === 'LIMIT_EXCEEDED') {
            setErrorResponse(res, 413, 'File bigger then 1Mb');
          } else {
            setErrorResponse(res, 500, `something went wrong error code: ${error.code}`);
          }
        });

        outStream.on('error', (error) => {
          deleteFile();
          setErrorResponse(res, 500, 'Internal server error');
        });

        outStream.on('close', () => {
          setErrorResponse(res, 201, 'file has been saved');
        });

        res.on('close', () => {
          if (!res.finished) {
            deleteFile();
          };

          var stats = fs.statSync(filepath)
          var fileSizeInBytes = stats["size"];
          if (fileSizeInBytes == 0) {
            deleteFile();
          }
        });

        req.on('error', (err) => {
          if (err.code === 'ECONNRESET') {
            deleteFile();
          }
        });
        
        req.on('aborted', () => {
          setErrorResponse(res, 500, 'Connect is aborted');
          deleteFile();
        }); 
  
        req.pipe(limitedStream).pipe(outStream);   

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  } 
});

module.exports = server;
