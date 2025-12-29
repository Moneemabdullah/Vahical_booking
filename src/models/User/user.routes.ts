import express from "express";
import {
    getUsers,
    getUserByID,
    updateUserByID,
    deleteUserByID,
} from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", auth("admin"), getUsers);
router.get("/:userid", auth("admin", "user"), getUserByID);
router.put("/:userid", auth("user"), updateUserByID);
router.delete("/:userid", auth("admin"), deleteUserByID);

export const UserRoutes = router;
