import { userService } from "./user.service";
import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();
        res.status(200).json({
            sucess: true,
            message: "Users retrieved successfully",
            data: users,
        });
    } catch (err) {
        const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred";
        res.status(500).json({
            sucess: false,
            error: errorMessage,
        });
    }
};

export const getUserByID = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const user = await userService.getUserbyID(id);
        res.status(200).json({
            sucess: true,
            message: "User retrieved successfully",
            data: user,
        });
    } catch (err) {
        const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred";
        res.status(500).json({
            sucess: false,
            message: errorMessage,
        });
    }
};

export const updateUserByID = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const user = await userService.updateUserByID(id, req.body);
        res.status(200).json({
            sucess: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (err) {
        const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred";
        res.status(500).json({
            sucess: false,
            message: errorMessage,
        });
    }
};

export const deleteUserByID = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const user = await userService.deletUserByID(id);
        res.status(200).json({
            sucess: true,
            message: "User deleted successfully",
            data: user,
        });
    } catch (err) {
        const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred";
        res.status(500).json({
            sucess: false,
            message: errorMessage,
        });
    }
};
