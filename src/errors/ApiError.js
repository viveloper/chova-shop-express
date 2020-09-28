class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.code = code;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = ApiError;
