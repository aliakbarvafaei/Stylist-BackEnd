// errors.js

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class MethodNotAllowedError extends Error {
  constructor(message) {
    super(message);
    this.name = "MethodNotAllowedError";
    this.statusCode = 405;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "Conflict";
    this.statusCode = 409;
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (res.headersSent) {
    // If headers have already been sent, delegate to Express default error handler
    return next(err);
  }

  // Determine HTTP status code and error message based on error type
  let statusCode;
  let message;
  if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message || "Not found";
  } else if (err instanceof UnauthorizedError) {
    statusCode = 401;
    message = err.message || "Unauthorized";
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    message = err.message || "Forbidden";
  } else if (err instanceof ConflictError) {
    statusCode = 409;
    message = err.message || "Conflict";
  } else if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message || "Bad request";
  } else {
    statusCode = 500;
    message = "Internal server error";
  }
  return res
    .status(statusCode)
    .json({
      error: message.split(",").length === 1 ? message : message.split(","),
    });
};

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  ConflictError,
  InternalServerError,
  errorHandler,
};
