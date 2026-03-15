import ENVIRONMENT from "../config/environment.config.js";

export const verifyApiKeyMiddleware = (req, res, next) => {

  /* =========================
     PERMITIR PREFLIGHT CORS
     ========================= */

  if (req.method === "OPTIONS") {
    return next();
  }

  /* =========================
     ENDPOINTS PUBLICOS
     ========================= */

  if (req.path.startsWith("/api/workspace/members/accept-invitation")) {
    return next();
  }

  /* =========================
     VALIDACION API KEY
     ========================= */

  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== ENVIRONMENT.API_KEY) {
    return res.status(401).json({
      ok: false,
      status: 401,
      message: "Unauthorized: Invalid or missing API Key"
    });
  }

  /* =========================
     API KEY VALIDA
     ========================= */

  next();
};