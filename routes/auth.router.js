import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

/* =========================
   REGISTER
========================= */

authRouter.post("/register", authController.register);

/* =========================
   LOGIN
========================= */

authRouter.post("/login", authController.login);

/* =========================
   LOGOUT
   Requiere usuario autenticado
========================= */

authRouter.post("/logout", authMiddleware, authController.logout);

/* =========================
   VERIFY EMAIL
========================= */

authRouter.get("/verify-email", authController.verifyEmail);

export default authRouter;
