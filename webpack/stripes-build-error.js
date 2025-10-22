module.exports = class StripesBuildError extends Error {
  constructor(...args) {
    super(...args);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, StripesBuildError);
  }
};
