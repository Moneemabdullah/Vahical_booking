import User from "./user.type";
import { pool } from "../../config/db";
import bcrypt from "bcrypt";

const createUser = async (user: User) => {
    user.password = await bcrypt.hash(user.password, 10);

    const result = await pool.query(
        `INSERT INTO "user" (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [user.name, user.email, user.password, user.phone, user.role]
    );
    return result.rows[0];
};
const getUsers = async () => {
    const result = await pool.query(`SELECT * FROM "user";`);
    return result.rows;
};

const getUserbyID = async (id: number) => {
    const result = await pool.query(`SELECT * FROM "user" WHERE id = $1;`, [
        id,
    ]);
    return result.rows[0];
};

const updateUserByID = async (id: number, user: Partial<User>) => {
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in user) {
        fields.push(`${key} = $${index}`);
        values.push((user as any)[key]);
        index++;
    }
    values.push(id);

    const result = await pool.query(
        `UPDATE "user" SET ${fields.join(
            ", "
        )} WHERE id = $${index} RETURNING *;`,
        values
    );
    return result.rows[0];
};

const deletUserByID = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM "user" WHERE id = $1 RETURNING *;`,
        [id]
    );
    return result.rows[0];
};

export const userService = {
    createUser,
    getUsers,
    getUserbyID,
    updateUserByID,
    deletUserByID,
};
