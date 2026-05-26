import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Set default values if not defined
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error!";
  let details = err;

  // Intercept Prisma Client errors and translate them into user-friendly messages
  if (err && err.name === "PrismaClientKnownRequestError") {
    statusCode = 400;
    switch (err.code) {
      case "P2002":
        const target = err.meta && Array.isArray(err.meta.target) 
          ? ` (${err.meta.target.join(", ")})` 
          : "";
        message = `A record with this unique attribute${target} already exists.`;
        break;
      case "P2025":
        statusCode = 404;
        message = "The requested record was not found or has been deleted.";
        break;
      case "P2003":
        message = "Database relationship constraint violation. A referenced record is missing.";
        break;
      default:
        message = `Database operation failed. (Code: ${err.code})`;
        break;
    }
  } else if (err && err.name === "PrismaClientValidationError") {
    statusCode = 400;
    message = "Database validation check failed. Please ensure all inputs are in the correct format.";
  } else if (err && err.name === "PrismaClientInitializationError") {
    statusCode = 500;
    message = "Unable to connect to the database server. Please check database configuration.";
  }

  // Format error response body
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? details : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
