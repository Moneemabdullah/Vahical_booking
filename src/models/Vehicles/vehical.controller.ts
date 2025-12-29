import { Request, Response } from "express";
import { vehicleService } from "./vehical.service";
import Vehicle from "./vehical.types";

const createVehicle = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            throw new Error("Request body is required");
        }
        const result = await vehicleService.addVehicle(
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
        // Read from path param
        let idParam = req.params.vehicleId;

        // Optional fallback to query param
        if (!idParam && req.query.id) {
            idParam = String(req.query.id);
        }

        const id = Number(idParam);

        // console.log("Raw param:", idParam, "Parsed ID:", id);

        if (!idParam || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID",
            });
        }

        const vehicle = await vehicleService.getVehicleById(id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: vehicle,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ success: false, message });
    }
};

const updateVehicleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId as string;
        const vehicle = await vehicleService.updateVehicleById(
            id,
            req.body as Partial<Vehicle>
        );
        // console.log(vehicle);
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
        const id = req.params.vehicleId as string;
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
