import mongoose from "mongoose";

const ws_membersSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true
        },
        fk_id_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
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
        role: {
            type: String,
            enum: ['admin', 'mod', 'user']
        }
    }
)

const Workspace_Member = mongoose.model ('Workspace Member', ws_membersSchema)

export default Workspace_Member