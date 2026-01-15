import mongoose from "mongoose";

const ws_channel_messagesSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true
        },
        fk_id_channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel',
            required: true
        },
        fk_id_workspace_member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace Member',
            required: true
        },
        content: {
            type: 'String',
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    }
)

const ws_channel_messages = mongoose.model ('Workspace Channel Messages', ws_channel_messagesSchema)

export default ws_channel_messages