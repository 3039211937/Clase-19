import MemberWorkspace from "../models/workspacemembers.model.js";
import Workspace from "../models/workspace.model.js";

class WorkspaceRepository {
    async getWorkspacesByUserId(user_id){
        //Busco a todos los miembros que pertenezcan al usuario
        //Esto seria buscar todas mis membresias
        const workspaces = await MemberWorkspace.find({fk_id_user: user_id})
        .populate('fk_id_workspace') //Esto permite expandir sobre la referencia a la tabla de espacios de trabajo

        return workspaces
    }
    async create (fk_id_owner, title, image, description){
        const workspace = await Workspace.create({
            fk_id_owner,
            title,
            image,
            description
        })
        return workspace
    }

    async addMember (workspace_id, user_id, role){
        const member = await MemberWorkspace.create({
            fk_id_workspace: workspace_id,
            fk_id_user: user_id,
            role
        })
        return member
    }
}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository