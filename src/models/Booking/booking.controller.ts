import { Request, Response } from "express";
import { BookingService } from "./booking.service";

export class BookingController {
    // POST → Create booking
    static async create(req: Request, res: Response) {
        try {
            const { vehicle_id, rent_start_date, rent_end_date } = req.body;
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated",
                });
            }
            const customerId = req.user.id as any; // From auth middleware

            const booking = await BookingService.createBooking(
                customerId as number,
                vehicle_id,
                rent_start_date,
                rent_end_date
            );

            res.status(201).json({
                success: true,
                message: "Booking created successfully.",
                data: booking,
            });
        } catch (err: any) {
            res.status(400).json({ success: false, message: err.message });
        }
    }

    // GET → All or own bookings
    static async getAll(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated",
                });
            }
            const role = req.user.role;
            const userId = req.user.id;

            const bookings = await BookingService.getBookings(role, userId);

            res.json({ success: true, data: bookings });
        } catch (err: any) {
            res.status(400).json({ success: false, message: err.message });
        }
    }

    // PUT → Cancel booking
    static async cancel(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated",
                });
            }
            const bookingId = Number(req.params.bookingId);
            const userId = req.user.id;

            const booking = await BookingService.cancelBooking(
                bookingId,
                userId
            );

            res.json({
                success: true,
                message: "Booking cancelled.",
                data: booking,
            });
        } catch (err: any) {
            res.status(400).json({ success: false, message: err.message });
        }
    }

    // PUT → Mark as returned (Admin)
    static async returnVehicle(req: Request, res: Response) {
        try {
            const bookingId = Number(req.params.bookingId);

            const booking = await BookingService.returnVehicle(bookingId);

            res.json({
                success: true,
                message: "Vehicle returned to available state.",
                data: booking,
            });
        } catch (err: any) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
}
