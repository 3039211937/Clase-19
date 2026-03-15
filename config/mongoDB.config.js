import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";

/*
==================================================
CONEXION A MONGODB (SERVERLESS SAFE)
==================================================

En entornos serverless como Vercel cada request puede
crear una nueva instancia del backend.

Para evitar abrir demasiadas conexiones a MongoDB,
guardamos la conexion en cache global.
*/

const connection_string = `${ENVIRONMENT.MONGO_DB_URI}/${ENVIRONMENT.MONGO_DB_NAME}`;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectMongoDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(connection_string, {
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log("Conexion a MongoDB exitosa");
    } catch (error) {
        cached.promise = null;
        console.error("Conexion con MongoDB fallo");
        console.error(error);
        throw error;
    }

    return cached.conn;
}