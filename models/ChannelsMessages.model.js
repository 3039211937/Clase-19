import mongoose from "mongoose";

/* =========================
   SCHEMA DE MENSAJES DE CANAL
========================= */

const channelMessagesSchema = new mongoose.Schema(
  {
    /* CONTENIDO DEL MENSAJE */

    mensaje: {
      type: String,
      required: true,
      trim: true,
    },

    /* RELACIÓN CON EL CANAL */

    fk_workspace_channel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
      index: true,
    },

    /* RELACIÓN CON EL MIEMBRO DEL WORKSPACE */

    fk_workspace_member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MemberWorkspace",
      required: true,
    },

    /* CAMPOS ÚTILES PARA CHAT */

    edited: {
      type: Boolean,
      default: false,
    },

    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },

  /* TIMESTAMPS AUTOMÁTICOS */

  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

/* =========================
   INDEX PARA PERFORMANCE
========================= */

/* Este índice hace que cargar mensajes por canal sea MUCHO más rápido */

channelMessagesSchema.index({
  fk_workspace_channel_id: 1,
  created_at: 1,
});

/* =========================
   MODELO
========================= */

const ChannelMessages = mongoose.model("MessageChannel", channelMessagesSchema);

export default ChannelMessages;
