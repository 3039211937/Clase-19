import ENVIRONMENT from "../config/environment.config.js";

export const verifyApiKeyMiddleware = (req, res, next) => {
  /* =========================
       ENDPOINTS PUBLICOS
       Estas rutas deben poder
       accederse sin API Key
       porque el usuario llega
       desde un link en el mail
    ========================= */

  if (req.path.startsWith("/api/workspace/members/accept-invitation")) {
    return next();
  }

  /* =========================
       VALIDACION DE API KEY
    ========================= */

  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== ENVIRONMENT.API_KEY) {
    return res.status(401).json({
      status: 401,
      ok: false,
      message: "Unauthorized: Invalid or missing API Key",
    });
  }

  /* =========================
       API KEY VALIDA
       continuar con la request
    ========================= */

  next();
};
