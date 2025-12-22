import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
    connectionString: config.dbUri,
    ssl: false,
});

const waitForDb = async (retries = 20, delayMs = 3000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await pool.query("SELECT 1");
            return;
        } catch (err) {
            const msg = (err as Error)?.message || String(err);
            console.log(
                `DB not ready (attempt ${attempt}/${retries}): ${msg}. Retrying in ${Math.floor(
                    delayMs / 1000
                )}s...`
            );
            await new Promise((res) => setTimeout(res, delayMs));
        }
    }
    throw new Error("Database connection failed after multiple attempts");
};

const initDb = async () => {
    // Wait for the database to be ready (important in Docker startup)
    await waitForDb();
    // CREATE USER TABLE
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "user"(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            role VARCHAR(10) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // ENUM TYPE
    await pool.query(`
        DO $$ BEGIN
            CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'van', 'SUV');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    `);

    // VEHICLE TABLE
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicle(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            type vehicle_type NOT NULL,
            model VARCHAR(50) NOT NULL,
            registration_number VARCHAR(50) UNIQUE NOT NULL,
            daily_rent_price NUMERIC CHECK (daily_rent_price > 0) NOT NULL,
            availability_status BOOLEAN DEFAULT true NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // BOOKING TABLE
    await pool.query(`
        CREATE TABLE IF NOT EXISTS booking(
            id SERIAL PRIMARY KEY,
            customer_id INTEGER REFERENCES "user"(id),
            vehicle_id INTEGER REFERENCES vehicle(id),
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_rent_price NUMERIC CHECK (total_rent_price > 0) NOT NULL,
            status VARCHAR(20) DEFAULT 'booked' NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log("Database initialized");
};

export default initDb;
