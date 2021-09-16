const { on } = require('events');
const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.encoding = options.encoding;
    this.remainder = 0;
  }

  _transform(chunk, encoding, callback) {    
    this.remainder += Buffer.from(chunk.toString(this.encoding)).length;
    
    if (this.remainder <= this.limit )
      {
        callback(null, chunk);
      }
    else
      {
        callback(new LimitExceededError); 
      }
  }
}

module.exports = LimitSizeStream;
