import express from "express";
import vehicleControllers from "./vehical.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/vehicles", auth("admin"), vehicleControllers.createVehicle);
router.get("/vehicles", vehicleControllers.getAllVehicles);
router.get("/vehicles/:vehicleId", vehicleControllers.getVehicleById);
router.put(
    "/vehicles/:vehicleId",
    auth("admin"),
    vehicleControllers.updateVehicleById
);
router.delete(
    "/vehicles/:vehicleId",
    auth("admin"),
    vehicleControllers.deleteVehicleById
);

export const VehicleRoutes = router;
