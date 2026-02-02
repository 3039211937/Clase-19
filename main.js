import express from "express";
import cors from "cors";

import { connectMongoDB } from "./config/mongoDB.config.js";
import authRouter from "./routes/auth.router.js";
import workspaceRouter from "./routes/workspace.router.js";
import randomMiddleware from "./middlewares/random.middleware.js";

// -----------------------------------------------------------------------------
// APP
// -----------------------------------------------------------------------------
const app = express();
const PORT = 8080;

// -----------------------------------------------------------------------------
// CORS
// -----------------------------------------------------------------------------
const whitelist = [
    "http://localhost:5173",
    "https://frontend-plrf.vercel.app"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (whitelist.includes(origin)) return callback(null, true);
        return callback(new Error("CORS not allowed"));
    },
    credentials: true
};

app.use(cors(corsOptions));

// -----------------------------------------------------------------------------
// JSON
// -----------------------------------------------------------------------------
app.use(express.json());

// -----------------------------------------------------------------------------
// LOG
// -----------------------------------------------------------------------------
app.use((req, res, next) => {
    console.log(req.method, req.originalUrl);
    next();
});

// -----------------------------------------------------------------------------
// HEALTH (ANTES DE TODO)
// -----------------------------------------------------------------------------
app.get("/health", (req, res) => {
    return res.json({ ok: true });
});

// -----------------------------------------------------------------------------
// MIDDLEWARE CUSTOM
// -----------------------------------------------------------------------------
app.use(randomMiddleware);

// -----------------------------------------------------------------------------
// RUTAS
// -----------------------------------------------------------------------------
app.use("/api/auth", authRouter);
app.use("/api/workspace", workspaceRouter);

// -----------------------------------------------------------------------------
// 404 FINAL (ULTIMO)
// -----------------------------------------------------------------------------
app.use((req, res) => {
    return res.status(404).json({
        error: "Not Found",
        method: req.method,
        path: req.originalUrl
    });
});

// -----------------------------------------------------------------------------
// START
// -----------------------------------------------------------------------------
app.listen(PORT, async () => {
    console.log(`Servidor escuchando en http://127.0.0.1:${PORT}`);
    await connectMongoDB();
});
