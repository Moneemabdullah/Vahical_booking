import { Router } from "express";
import { BookingController } from "./booking.controller";
import auth from "../../middlewares/auth";

const router = Router();

// Create booking
router.post("/", auth("user"), BookingController.create);

// Get all or own bookings
router.get("/", auth("user"), BookingController.getAll);

// Cancel booking (customer)
router.put("/:bookingId/cancel", auth("user"), BookingController.cancel);

// Mark returned (admin)
router.put(
    "/:bookingId/return",
    auth("admin"),
    BookingController.returnVehicle
);

export const BookingRoutes = router;
