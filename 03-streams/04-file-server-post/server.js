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
    return;
  };   
 /* Перенес в outStream.on
   if (fs.existsSync(filepath)) {
    setErrorResponse(res, 409,'File is exists');
    return;
  };  
*/

  switch (req.method) {
    case 'POST':   
        const limitedStream = new LimitSizeStream({limit: limitNum});
        const outStream = fs.createWriteStream(filepath, {flags: 'wx'}); 
        
        const deleteFile = () => {
          outStream.destroy();
          fs.unlinkSync(filepath);
        };

        limitedStream.on('error', (err) => {          
          if (err.code == 'LIMIT_EXCEEDED') {
            setErrorResponse(res, 413, 'File bigger then 1Mb');
          } else {
            setErrorResponse(res, 500, `something went wrong error code: ${err.code}`);
          };
          deleteFile();
        });

        outStream.on('error', (err) => {   
          switch (err.code) {
            case 'EEXIST':
              setErrorResponse(res, 409, `file "${filepath}" already exists`);
              break;
            default:
              setErrorResponse(res, 500, 'unknown error');
              deleteFile();
          }          
        });

        outStream.on('finish', () => {
          setErrorResponse(res, 201, 'file has been saved');
        });

      /*  res.on('finish', () => {
          var stats = fs.statSync(filepath)
          var fileSizeInBytes = stats["size"];
          if (fileSizeInBytes == 0) {
            deleteFile();
          }
        });*/

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
