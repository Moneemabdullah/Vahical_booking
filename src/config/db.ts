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
        } catch {
            console.log(
                `DB not ready (attempt ${attempt}/${retries}). Retrying...`
            );
            await new Promise((res) => setTimeout(res, delayMs));
        }
    }
    throw new Error("Database connection failed");
};

const initDb = async () => {
    await waitForDb();

    /* ======================
      USERS
  ====================== */
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL CHECK (length(password) >= 6),
      phone VARCHAR(20) NOT NULL,
      role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'customer')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

    /* ======================
      ENUM TYPES (SAFE)
  ====================== */
    await pool.query(`
    DO $$ BEGIN
      CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'van', 'SUV');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

    await pool.query(`
    DO $$ BEGIN
      CREATE TYPE availability_status_enum AS ENUM ('available', 'booked');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

    await pool.query(`
    DO $$ BEGIN
      CREATE TYPE booking_status_enum AS ENUM ('active', 'cancelled', 'returned');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

    /* ======================
      VEHICLES
  ====================== */
    await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(100) NOT NULL,
      type vehicle_type NOT NULL,
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
      availability_status availability_status_enum
        NOT NULL DEFAULT 'available',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

    /* ======================
      BOOKINGS
  ====================== */
    await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INTEGER NOT NULL
        REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price NUMERIC NOT NULL CHECK (total_price > 0),
      status booking_status_enum NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CHECK (rent_end_date > rent_start_date)
    );
  `);

    console.log("✅ Database initialized successfully");
};

export default initDb;
