import { channelRepository } from "../repository/channel.repository.js";

class ChannelController {
  async getAllByWorkspaceId(request, response) {
    try {
      const { workspace_id } = request.params;

      const channels =
        await channelRepository.getAllByWorkspaceId(workspace_id);

      response.json({
        status: 200,
        ok: true,
        message: "Canales obtenidos con exito",
        data: { channels },
      });
    } catch (error) {
      console.log("Error obteniendo canales", error);

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

  async create(request, response) {
    try {
      const { name } = request.body;
      const { workspace_id } = request.params;

      const channel_created = await channelRepository.create(
        workspace_id,
        name,
      );

      response.json({
        status: 201,
        ok: true,
        message: "Canal creado con exito",
        data: { channel_created },
      });
    } catch (error) {
      console.log("Error creando canal", error);

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

  async delete(request, response) {
    try {
      const { channel_id } = request.params;

      await channelRepository.delete(channel_id);

      return response.json({
        status: 200,
        ok: true,
        message: "Canal eliminado con exito",
        data: null,
      });
    } catch (error) {
      console.log("Error eliminando canal", error);

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

const channelController = new ChannelController();

export { channelController };
