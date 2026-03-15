import { connectMongoDB } from "./config/mongoDB.config.js";
import express from "express";
import authRouter from "./routes/auth.router.js";
import cors from "cors";
import workspaceRouter from "./routes/workspace.router.js";
import { verifyApiKeyMiddleware } from "./middlewares/apikey.middleware.js";
import { errorHandlerMiddleware } from "./middlewares/error.middleware.js";

/*
Conectamos a MongoDB
*/
connectMongoDB();

const app = express();

/*
Middlewares globales
*/
app.use(cors());
app.use(express.json());
app.use(verifyApiKeyMiddleware);

/*
Endpoint de prueba
*/
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Servidor funcionando correctamente",
    data: null,
  });
});

/*
Rutas principales
*/
app.use("/api/auth", authRouter);
app.use("/api/workspace", workspaceRouter);

/*
Middleware global de errores
*/
app.use(errorHandlerMiddleware);

/*
Exportamos la app para Vercel
(NO usar app.listen en serverless)
*/
export default app;
