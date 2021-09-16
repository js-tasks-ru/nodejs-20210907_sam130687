const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.encoding = options.encoding;
    this.gub = '';
  }

  _transform(chunk, encoding, callback) {
     let str = chunk.toString(this.encoding);

     if (str.lastIndexOf(os.EOL) > -1) 
     {
      str = this.gub+str;
      this.gub = '';
      str.split(os.EOL).forEach((item, i, arr) => 
        {
          if (i < arr.length - 1)
          {
            this.push(item);
          }
          else
          {
            this.gub = item;
          }
        });       
     }
     else
     {
      this.gub = this.gub+str;
     }
    callback(null);
  }

  _flush(callback) {
    callback(null, this.gub);
  }
}

module.exports = LineSplitStream;
