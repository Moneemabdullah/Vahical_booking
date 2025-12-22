import { Router } from "express";
import { AuthController } from "./auth.controller";
const router = Router();
router.post("/signin", AuthController.login);
router.post("/signup", AuthController.register);

export const AuthRoutes = router;
