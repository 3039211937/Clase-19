import messagesRepository from "../repository/messages.repository.js";

class MessagesController {
  /* =========================
     CREAR MENSAJE
  ========================= */

  async create(req, res) {
    try {
      const { mensaje } = req.body;
      const { channel_id } = req.params;

      const member_id = req.member._id;

      if (!mensaje || !channel_id) {
        return res.status(400).json({
          ok: false,
          message: "Faltan datos",
        });
      }

      const message = await messagesRepository.create(
        member_id,
        mensaje,
        channel_id,
      );

      return res.status(201).json({
        ok: true,
        message: "Mensaje creado",
        data: {
          message,
        },
      });
    } catch (error) {
      console.error("Error creando mensaje:", error);

      return res.status(500).json({
        ok: false,
        message: "Error interno del servidor",
      });
    }
  }

  /* =========================
     OBTENER MENSAJES DEL CANAL
  ========================= */

  async getByChannelId(req, res) {
    try {
      const { channel_id } = req.params;

      const messages = await messagesRepository.getByChannelId(channel_id);

      return res.status(200).json({
        ok: true,
        data: {
          messages,
        },
      });
    } catch (error) {
      console.error("Error obteniendo mensajes:", error);

      return res.status(500).json({
        ok: false,
        message: "Error interno del servidor",
      });
    }
  }
}

export default new MessagesController();
