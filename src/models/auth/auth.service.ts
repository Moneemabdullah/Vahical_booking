import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const loginUser = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM "user" WHERE email=$1`, [
        email,
    ]);

    if (result.rows.length === 0) return null;

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) return false;

    const token = jwt.sign(
        { name: user.name, email: user.email, role: user.role },
        config.jwtSecret!,
        { expiresIn: "7d" }
    );

    return { token, user };
};

const registerUser = async (
    name: string,
    email: string,
    password: string,
    role: string,
    phone: string
) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const emailQuery = await pool.query(`SELECT * FROM "user" WHERE email=$1`, [
        email,
    ]);
    if (emailQuery.rows.length > 0) {
        throw new Error("Email already exists");
    }

    const result = await pool.query(
        `INSERT INTO "user" (name, email, password, phone, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, email, hashedPassword, phone, role]
    );

    return result.rows[0];
};

export { loginUser, registerUser };
