import express from "express";
import {
    getUsers,
    getUserByID,
    updateUserByID,
    deleteUserByID,
} from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/users", auth("admin"), getUsers);
router.get("/users/:userid", auth("admin"), getUserByID);
router.put("/users/:userid", auth("user"), updateUserByID);
router.delete("/users/:userid", auth("admin"), deleteUserByID);

export const UserRoutes = router;
