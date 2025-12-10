import { loginUser, registerUser } from "./auth.service";
import { Request, Response } from "express";

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
            const { name, email, password, role, phone } = req.body;

            const user = await registerUser(name, email, password, role, phone);

            res.status(201).json({
                message: "User registered successfully",
                data: user,
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    },
};
