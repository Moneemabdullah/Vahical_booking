import { VehicleRoutes } from "./models/Vehicles/vahical.routes";
import { BookingRoutes } from "./models/Booking/booking.route";
import { UserRoutes } from "./models/User/user.routes";
import { AuthRoutes } from "./models/auth/auth.routes";

import express from "express";

const router = express.Router();

router.use("/v1/vehicles", VehicleRoutes);
router.use("/v1/bookings", BookingRoutes);
router.use("/v1/users", UserRoutes);
router.use("/v1/auth", AuthRoutes);

export default router;
