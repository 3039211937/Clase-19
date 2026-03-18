import { connectMongoDB } from "./config/mongoDB.config.js";
import express from "express";
import authRouter from "./routes/auth.router.js";
import cors from "cors";
import workspaceRouter from "./routes/workspace.router.js";
import { verifyApiKeyMiddleware } from "./middlewares/apikey.middleware.js";
import { errorHandlerMiddleware } from "./middlewares/error.middleware.js";

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
CRITICAL FIX → ENSURE DB BEFORE ROUTES
==================================================
*/

app.use(async (req, res, next) => {
  try {
    await connectMongoDB(); // ✅ THIS FIXES VERCEL
    next();
  } catch (error) {
    console.error("DB CONNECTION ERROR:", error);

    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error conectando a la base de datos",
    });
  }
});

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
*/

if (process.env.NODE_ENV !== "production") {
  const PORT = 8082;

  const startServer = async () => {
    try {
      await connectMongoDB(); // ✅ local startup safe

      app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Error iniciando el servidor:", error);
    }
  };

  startServer();
}

/*
==================================================
EXPORT PARA VERCEL
==================================================
*/

export default app;
