import { pool } from "../../config/db";
import Vehicle from "./vehical.types";

const addVehicle = async (vehicle: Vehicle): Promise<Vehicle> => {
    const result = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [
            vehicle.vehicle_name,
            vehicle.type,
            vehicle.registration_number,
            vehicle.daily_rent_price,
            vehicle.availability_status,
        ]
    );
    return result.rows[0];
};

const getAllVehicles = async (): Promise<Vehicle[]> => {
    const result = await pool.query(`SELECT * FROM vehicles;`);
    return result.rows;
};

const getVehicleById = async (vehicleId: number): Promise<Vehicle | null> => {
    try {
        const result = await pool.query(
            `SELECT * FROM vehicles WHERE id = $1`,
            [vehicleId]
        );

        console.log(result.rows, vehicleId);

        return result.rows[0] || null;
    } catch (error) {
        console.error("Error fetching vehicle by ID:", error);
        throw error;
    }
};

const updateVehicleById = async (
    vehicleId: string,
    vehicle: Partial<Vehicle>
): Promise<Vehicle | null> => {
    const fields = [];
    const values = [];
    let index = 1;
    console.log(vehicleId);
    for (const key in vehicle) {
        fields.push(`${key} = $${index}`);
        values.push((vehicle as any)[key]);
        index++;
    }

    values.push(vehicleId); // add ID for WHERE clause

    const result = await pool.query(
        `UPDATE vehicles SET ${fields.join(
            ", "
        )} WHERE id = $${index} RETURNING *;`,
        values
    );

    return result.rows[0] || null;
};

const deleteVehicleById = async (vehicleId: string) => {
    const result = await pool.query(
        `DELETE FROM vehicles 
         WHERE id = $1
         AND availability_status != 'booked'
         RETURNING *;`,
        [vehicleId]
    );

    if (!result.rows[0]) {
        throw new Error("Vehicle cannot be deleted because it is booked");
    }

    return result.rows[0];
};

export const vehicleService = {
    addVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicleById,
    deleteVehicleById,
};
