import { pool } from "../../config/db";

export class BookingService {
    // Create Booking
    static async createBooking(
        customerId: number,
        vehicleId: number,
        startDate: string,
        endDate: string
    ) {
        // 1. Check vehicle availability
        const vehicle = await pool.query(
            `SELECT * FROM vehicle 
             WHERE id = $1 AND availability_status = TRUE`,
            [vehicleId]
        );

        if (vehicle.rows.length === 0) {
            throw new Error("Vehicle is not available for booking.");
        }

        const dailyRate = Number(vehicle.rows[0].daily_rent_price);

        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (days <= 0) throw new Error("Invalid date range.");

        const totalPrice = dailyRate * days;

        // 2. Create booking
        const booking = await pool.query(
            `INSERT INTO booking (customer_id, vehicle_id, rent_start_date, rent_end_date, total_rent_price)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [customerId, vehicleId, startDate, endDate, totalPrice]
        );

        // 3. Update vehicle status to booked
        await pool.query(
            `UPDATE vehicle SET availability_status = FALSE WHERE id = $1`,
            [vehicleId]
        );

        return booking.rows[0];
    }

    // Get all or customer-specific bookings
    static async getBookings(role: string, userId: number) {
        if (role === "admin") {
            const result = await pool.query(`SELECT * FROM booking`);
            return result.rows;
        }

        const result = await pool.query(
            `SELECT * FROM booking WHERE customer_id = $1`,
            [userId]
        );
        return result.rows;
    }

    // Cancel Booking (Customer only)
    static async cancelBooking(bookingId: number, userId: number) {
        const booking = await pool.query(
            `SELECT * FROM booking WHERE id = $1 AND customer_id = $2`,
            [bookingId, userId]
        );

        if (booking.rows.length === 0) {
            throw new Error("Booking not found or unauthorized.");
        }

        const startDate = new Date(booking.rows[0].rent_start_date);
        if (new Date() >= startDate) {
            throw new Error("Cannot cancel booking after it has started.");
        }

        // Delete or update status
        const result = await pool.query(
            `UPDATE booking SET status = 'cancelled' WHERE id = $1 RETURNING *`,
            [bookingId]
        );

        // Release vehicle
        await pool.query(
            `UPDATE vehicle SET availability_status = TRUE 
             WHERE id = $1`,
            [booking.rows[0].vehicle_id]
        );

        return result.rows[0];
    }

    // Admin: Mark vehicle returned
    static async returnVehicle(bookingId: number) {
        const booking = await pool.query(
            `SELECT * FROM booking WHERE id = $1`,
            [bookingId]
        );

        if (booking.rows.length === 0) {
            throw new Error("Booking not found.");
        }

        const result = await pool.query(
            `UPDATE booking SET status = 'returned' WHERE id = $1 RETURNING *`,
            [bookingId]
        );

        // Update vehicle availability
        await pool.query(
            `UPDATE vehicle SET availability_status = TRUE 
             WHERE id = $1`,
            [booking.rows[0].vehicle_id]
        );

        return result.rows[0];
    }
}
