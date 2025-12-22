import { Router } from "express";
import { BookingController } from "./booking.controller";
import auth from "../../middlewares/auth";

const router = Router();

// Create booking
router.post("/bookings", auth("user"), BookingController.create);

// Get all or own bookings
router.get("/bookings", auth("user"), BookingController.getAll);

// Cancel booking (customer)
router.put("/bookings/:bookingId", auth("user"), BookingController.cancel);

export const BookingRoutes = router;
