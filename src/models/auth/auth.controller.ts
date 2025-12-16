import { Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service";

export const AuthController = {
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const result = await loginUser(email, password);
            if (result === null) {
                return res
                    .status(404)
                    .json({ message: "User with this email not found" });
            }
            if (result === false) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            res.status(200).json({
                message: "Login successful",
                data: result,
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    },
    register: async (req: Request, res: Response) => {
        try {
            if (!req.body) {
                return res.status(400).json({
                    success: false,
                    message: "Request body is missing. Send JSON data.",
                });
            }

            const { name, email, password, role, phone } = req.body;

            if (!name || !email || !password || !role || !phone) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }

            const user = await registerUser(name, email, password, role, phone);

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user,
            });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    },
};
