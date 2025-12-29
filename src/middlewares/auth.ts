import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

// roles = ["admin", "user"]
const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            // ❌ No token
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: No token provided",
                });
            }

            // ✅ Extract token
            const token = authHeader.split(" ")[1];

            // ✅ Verify token
            const decoded = jwt.verify(
                token as string,
                config.jwtSecret as string
            ) as JwtPayload;

            req.user = decoded;

            // ✅ Role based authorization
            if (roles.length && !roles.includes(decoded.role as string)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have access",
                });
            }

            next();
        } catch (err: any) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
    };
};

export default auth;
