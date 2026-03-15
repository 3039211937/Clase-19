import { connectMongoDB } from "./config/mongoDB.config.js";
import express from "express";
import authRouter from "./routes/auth.router.js";
import cors from "cors";
import workspaceRouter from "./routes/workspace.router.js";
import { verifyApiKeyMiddleware } from "./middlewares/apikey.middleware.js";
import { errorHandlerMiddleware } from "./middlewares/error.middleware.js";

/*
==================================================
CONEXIÓN A MONGODB
==================================================
*/
connectMongoDB();

const app = express();

/*
==================================================
MIDDLEWARES
==================================================
*/

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://frontend-rose-one-24.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
  }),
);

app.use(express.json());
app.use(verifyApiKeyMiddleware);

/*
==================================================
ENDPOINT DE PRUEBA
==================================================
*/

app.get("/", (request, response) => {
  response.json({
    ok: true,
    message: "Servidor funcionando correctamente",
    data: null,
  });
});

/*
==================================================
RUTAS
==================================================
*/

app.use("/api/auth", authRouter);
app.use("/api/workspace", workspaceRouter);

/*
==================================================
MANEJO GLOBAL DE ERRORES
==================================================
*/

app.use(errorHandlerMiddleware);

/*
==================================================
MODO LOCAL (DESARROLLO)
==================================================

Cuando ejecutamos con:
npm run dev

levantamos el servidor normalmente
*/

if (process.env.NODE_ENV !== "production") {
  const PORT = 8082;

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

/*
==================================================
EXPORT PARA VERCEL
==================================================

Vercel utiliza funciones serverless y necesita
que exportemos la app en lugar de usar listen().
*/

export default app;
