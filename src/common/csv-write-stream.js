const stream = require('stream');
const { isArray } = require('lodash');

class CsvWriter extends stream.Transform {
  constructor(options = {}) {
    super({
      objectMode: true,
    });

    this.headers = options.headers || null;
    this._first = true;
  }

  _transform(chunk, encoding, next) {
    if (!this.headers) this.headers = Object.keys(chunk);

    if (this._first && this.headers) {
      this._first = false;
      this.push(this.headers.join(',') + '\n');
    }
    const row =
      this.headers
        .map((v) => {
          const c = chunk[v];
          if (c == null && Object.keys(chunk)[v] == null) next(new Error('can not find value in key of ' + v));
          return c;
        })
        .join(',') + '\n';
    this.push(row);
    next();
  }
}

// const ObjToCsv = through2.ctor({ objectMode: true, header: true }, function (record, encoding, next) {
//   this.headers = Object.keys(record);
//   if (this.options.header && this.headers) {
//     this.options.header = false;
//     this.push(this.headers.join(',') + '\n');
//   }
//   const row = this.headers.map((v) => record[v]).join(',') + '\n';
//   this.push(row);
//   next();
// });

module.exports = CsvWriter;
