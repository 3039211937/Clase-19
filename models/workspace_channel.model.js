import mongoose from "mongoose";

const workspace_channelSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true
        },
        fk_id_workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        active: {
            type: Boolean,
            default: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        }
    }
)

const Workspace_Channel = mongoose.model ('Workspace Channel', userSchema)

export default Workspace_Channel