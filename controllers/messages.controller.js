import messagesRepository from "../repository/messages.repository.js";

class MessagesController {
  /* =========================
     CREAR MENSAJE
  ========================= */

  async create(request, response) {
    try {
      const { mensaje } = request.body; // el frontend envía "mensaje"
      const member_id = request.member._id;
      const { channel_id } = request.params;

      const message_created = await messagesRepository.create(
        member_id,
        mensaje,
        channel_id,
      );

      return response.json({
        ok: true,
        status: 201,
        message: "Mensaje creado con éxito",
        data: {
          message: message_created,
        },
      });
    } catch (error) {
      console.log("Error en crear mensaje", error);

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
        message: "Error interno del servidor",
        data: null,
      });
    }
  }

  /* =========================
     OBTENER MENSAJES DEL CANAL
  ========================= */

  async getByChannelId(request, response) {
    try {
      const { channel_id } = request.params;

      const messages = await messagesRepository.getByChannelId(channel_id);

      return response.json({
        ok: true,
        status: 200,
        message: "Mensajes obtenidos con éxito",
        data: {
          messages,
        },
      });
    } catch (error) {
      console.log("Error obteniendo mensajes", error);

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
        message: "Error interno del servidor",
        data: null,
      });
    }
  }
}

const messagesController = new MessagesController();

export default messagesController;
