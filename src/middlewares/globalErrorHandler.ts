import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Set default values if not defined
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";

  // Format error response body
  res.status(statusCode).json({
    success: false,
    message,
    error: err,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
