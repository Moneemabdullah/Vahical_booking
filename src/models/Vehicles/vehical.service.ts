import { pool } from "../../config/db";
import Vehicle from "./vehical.types";

const addvehicle = async (vehicle: Vehicle): Promise<Vehicle> => {
    const result = await pool.query(
        `INSERT INTO vehicles (vehical_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [
            vehicle.vehical_name,
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

const getVehicleById = async (vechcalId: string): Promise<Vehicle | null> => {
    const result = await pool.query(
        `SELECT * FROM vehicles WHERE registration_number = $1;`,
        [vechcalId]
    );
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
};

const updateVehicleById = async (
    vechcalId: string,
    vehicle: Partial<Vehicle>
): Promise<Vehicle | null> => {
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in vehicle) {
        fields.push(`${key} = $${index}`);
        values.push((vehicle as any)[key]);
        index++;
    }
    values.push(vechcalId);
    const result = await pool.query(
        `UPDATE vehicles SET ${fields.join(
            ", "
        )} WHERE registration_number = $${index} RETURNING *;`,
        values
    );
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
};

const deleteVehicleById = async (vehicleId: string) => {
    const result = await pool.query(
        `
        DELETE FROM vehicle 
        WHERE id = $1 
        AND availability_status = FALSE
        RETURNING *;
        `,
        [vehicleId]
    );

    return result.rows[0] || null;
};

export const vehicleService = {
    addvehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicleById,
    deleteVehicleById,
};
