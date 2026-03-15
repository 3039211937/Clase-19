import { connectMongoDB } from "./config/mongoDB.config.js";
import express from "express";
import authRouter from "./routes/auth.router.js";
import cors from "cors";
import workspaceRouter from "./routes/workspace.router.js";
import { verifyApiKeyMiddleware } from "./middlewares/apikey.middleware.js";
import { errorHandlerMiddleware } from "./middlewares/error.middleware.js";

connectMongoDB();

const app = express();

/*
==============================
MIDDLEWARES
==============================
*/

app.use(cors());
app.use(express.json());
app.use(verifyApiKeyMiddleware);

/*
==============================
ENDPOINT DE PRUEBA
==============================
*/

app.get("/", (request, response) => {
  response.json({
    ok: true,
    message: "Servidor funcionando correctamente",
    data: null,
  });
});

/*
==============================
RUTAS
==============================
*/

app.use("/api/auth", authRouter);
app.use("/api/workspace", workspaceRouter);

/*
==============================
MANEJO DE ERRORES
==============================
*/

app.use(errorHandlerMiddleware);

/*
==============================
MODO LOCAL (NODE)
==============================

Si el archivo se ejecuta directamente con Node,
levantamos el servidor local en el puerto 8082.
*/

if (process.env.NODE_ENV !== "production") {
  const PORT = 8082;

  app.listen(PORT, () => {
    console.log(`Servidor local corriendo en http://localhost:${PORT}`);
  });
}

/*
==============================
EXPORT PARA VERCEL
==============================
*/

export default app;
