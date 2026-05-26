import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";

// Extend Express Request interface to hold verified user information
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; email: string; role: string; employeeId: string };
    }
  }
}

/**
 * Authentication and authorization middleware.
 * Verifies JWT token and checks if the user's role is allowed.
 */
const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(401, "You are not authorized! Token is missing.");
      }

      // Extract raw token string
      const token = authHeader.split(" ")[1];

      // Decode and verify JWT
      const jwtSecret = process.env.JWT_SECRET || "supersecretkey";
      let decoded: JwtPayload;
      
      try {
        decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      } catch (err) {
        throw new AppError(401, "Session expired or invalid token. Please login again.");
      }

      // Check if user role matches requirements
      const userRole = decoded.role;
      if (requiredRoles.length && !requiredRoles.includes(userRole)) {
        throw new AppError(403, "Access Forbidden: You do not have permissions to access this route.");
      }

      // Attach decoded payload to request object
      req.user = decoded as any;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
