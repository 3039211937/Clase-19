import mongoose from "mongoose";
import ChannelMessages from "../models/ChannelsMessages.model.js";

class MessagesRepository {
  /* =========================
     CREAR MENSAJE
  ========================= */

  async create(member_id, mensaje, channel_id) {
    const message = await ChannelMessages.create({
      fk_workspace_member_id: new mongoose.Types.ObjectId(member_id),
      mensaje: mensaje,
      fk_workspace_channel_id: new mongoose.Types.ObjectId(channel_id),
    });

    // 🔥 IMPORTANT: return populated message
    const populatedMessage = await ChannelMessages.findById(message._id)
      .populate({
        path: "fk_workspace_member_id",
        select: "role fk_id_user",
        populate: {
          path: "fk_id_user",
          select: "username email",
        },
      })
      .lean();

    return populatedMessage;
  }

  /* =========================
     OBTENER MENSAJES POR CANAL
  ========================= */

  async getByChannelId(channel_id) {
    return await ChannelMessages.find({
      fk_workspace_channel_id: new mongoose.Types.ObjectId(channel_id),
    })
      .sort({ created_at: 1 })
      .populate({
        path: "fk_workspace_member_id",
        select: "role fk_id_user",
        populate: {
          path: "fk_id_user",
          select: "username email",
        },
      })
      .lean();
  }
}

const messagesRepository = new MessagesRepository();

export default messagesRepository;
