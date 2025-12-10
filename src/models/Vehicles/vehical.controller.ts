import { Request, Response } from "express";
import { vehicleService } from "./vehical.service";
import Vehicle from "./vehical.types";

const createVehicle = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            throw new Error("Request body is required");
        }
        const result = await vehicleService.addvehicle(
            req.body as unknown as Vehicle
        );

        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result,
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unknown error occurred";
        res.status(500).json({
            success: false,
            message: errorMessage,
        });
    }
};

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await vehicleService.getAllVehicles();
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: vehicles,
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unknown error occurred";
        res.status(500).json({
            success: false,
            message: errorMessage,
        });
    }
};
const getVehicleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const vehicle = await vehicleService.getVehicleById(id);
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: vehicle,
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unknown error occurred";
        res.status(500).json({
            success: false,
            message: errorMessage,
        });
    }
};

const updateVehicleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const vehicle = await vehicleService.updateVehicleById(
            id,
            req.body as Partial<Vehicle>
        );
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: vehicle,
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unknown error occurred";
        res.status(500).json({
            success: false,
            message: errorMessage,
        });
    }
};

const deleteVehicleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const vehicle = await vehicleService.deleteVehicleById(id);
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
            data: vehicle,
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unknown error occurred";
        res.status(500).json({
            success: false,
            message: errorMessage,
        });
    }
};

const vehicleControllers = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicleById,
    deleteVehicleById,
};

export default vehicleControllers;
