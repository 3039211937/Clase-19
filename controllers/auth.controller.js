import ENVIRONMENT from "../config/environment.config.js";
import userRepository from "../repository/user.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mail_transporter from "../config/mail.config.js";
import ServerError from "../helpers/error.helpers.js";

class AuthController {
  async register(request, response) {
    try {
      const { email, password, username } = request.body;

      if (!email || !password || !username) {
        throw new ServerError("Debes enviar todos los datos", 400);
      }

      const user = await userRepository.buscarUnoPorEmail(email);

      if (user) {
        throw new ServerError("El email ya esta registrado", 400);
      }

      const hashed_password = await bcrypt.hash(password, 10);

      await userRepository.crear(email, hashed_password, username);

      const token = jwt.sign({ email }, ENVIRONMENT.JWT_SECRET_KEY, {
        expiresIn: "24h",
      });

      console.log("Sending verification email to:", email);

      await mail_transporter.sendMail({
        to: email,
        from: ENVIRONMENT.GMAIL_USERNAME,
        subject: "Verifica tu email",
        html: `
          <h1>Bienvenido ${username}</h1>

          <p>Necesitamos que verifiques tu email</p>

          <p>Si no reconoces este registro, puedes ignorar este mensaje</p>

          <p>Haz click en el siguiente botón para verificar tu cuenta:</p>

          <a href='${ENVIRONMENT.URL_FRONTEND}/verify-email?token=${token}'>
            Verificar email
          </a>
        `,
      });

      return response.json({
        message: "Usuario creado exitosamente",
        status: 201,
        ok: true,
        data: null,
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      if (error.status) {
        return response.json({
          status: error.status,
          ok: false,
          message: error.message,
          data: null,
        });
      }

      return response.json({
        ok: false,
        status: 500,
        message: error.message || "Error interno del servidor",
        data: null,
      });
    }
  }

  async login(request, response) {
    try {
      const { email, password } = request.body;

      if (!email) {
        throw new ServerError("Debes enviar un email", 400);
      }

      if (!password) {
        throw new ServerError("Debes enviar una contraseña", 400);
      }

      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        throw new ServerError("El email no es valido", 400);
      }

      const usuario_encontrado = await userRepository.buscarUnoPorEmail(email);

      if (!usuario_encontrado) {
        throw new ServerError("Credenciales invalidas", 401);
      }

      const password_valido = await bcrypt.compare(
        password,
        usuario_encontrado.password,
      );

      if (!password_valido) {
        throw new ServerError("Credenciales invalidas", 401);
      }

      if (!usuario_encontrado.email_verified) {
        throw new ServerError("Usuario con email no verificado", 401);
      }

      const datos_del_token = {
        username: usuario_encontrado.username,
        email: usuario_encontrado.email,
        id: usuario_encontrado._id,
      };

      const auth_token = jwt.sign(datos_del_token, ENVIRONMENT.JWT_SECRET_KEY, {
        expiresIn: "24h",
      });

      return response.json({
        message: "Inicio de sesion exitoso",
        ok: true,
        status: 200,
        data: {
          auth_token,
        },
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.status) {
        return response.json({
          status: error.status,
          ok: false,
          message: error.message,
          data: null,
        });
      }

      return response.json({
        ok: false,
        status: 500,
        message: error.message || "Error interno del servidor",
        data: null,
      });
    }
  }

  async logout(request, response) {
    try {
      console.log("Logout usuario:", request.user?.email);

      return response.json({
        ok: true,
        status: 200,
        message: "Sesion cerrada correctamente",
        data: null,
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);

      return response.json({
        ok: false,
        status: 500,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }

  async verifyEmail(request, response) {
    try {
      const { token } = request.query;

      if (!token) {
        throw new ServerError("No se envio el token de verificacion", 400);
      }

      const { email } = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY);

      const user_found = await userRepository.buscarUnoPorEmail(email);

      if (!user_found) {
        throw new ServerError("No existe usuario con ese mail", 404);
      }

      if (user_found.email_verified) {
        return response.json({
          ok: true,
          status: 200,
          message: "Usuario ya verificado",
          data: null,
        });
      }

      await userRepository.actualizarPorId(user_found._id, {
        email_verified: true,
      });

      return response.json({
        ok: true,
        status: 200,
        message: "Email verificado correctamente",
        data: null,
      });
    } catch (error) {
      console.error("VERIFY EMAIL ERROR:", error);

      if (error instanceof jwt.JsonWebTokenError) {
        return response.json({
          ok: false,
          status: 401,
          message: "Token invalido o expirado",
          data: null,
        });
      }

      if (error.status) {
        return response.json({
          status: error.status,
          ok: false,
          message: error.message,
          data: null,
        });
      }

      return response.json({
        ok: false,
        status: 500,
        message: error.message || "Error interno del servidor",
        data: null,
      });
    }
  }
}

const authController = new AuthController();

export default authController;
