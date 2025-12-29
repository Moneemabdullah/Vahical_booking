import express from "express";
import vehicleControllers from "./vehical.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth("admin"), vehicleControllers.createVehicle);
router.get("/", vehicleControllers.getAllVehicles);
router.get("/:vehicleId", vehicleControllers.getVehicleById);
router.put(
    "/:vehicleId",
    auth("admin"),
    vehicleControllers.updateVehicleById
);
router.delete(
    "/:vehicleId",
    auth("admin"),
    vehicleControllers.deleteVehicleById
);

export const VehicleRoutes = router;
