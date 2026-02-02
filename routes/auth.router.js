import express from "express";
import authController from "../controllers/auth.controller.js";

// Crear el router de autenticación
const authRouter = express.Router();

// Registro de usuario
authRouter.post("/register", authController.register);

// Login de usuario
authRouter.post("/login", authController.login);

// Verificación de email
authRouter.get("/verify-email", authController.verifyEmail);

export default authRouter;
