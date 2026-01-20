import workspaceRepository from "../repository/workspace.repository.js"

class WorkspaceController {
    async getWorkspaces (request, response){
        //Quiero obtener los espacios de trabajo asociados al cliente que hace la consulta
        console.log("El usuario logueado es: ", request.user) //request.user
        const user_id = request.user.id
        const workspaces = await workspaceRepository.getWorkspacesByUserId(user_id)
        response.json({
            ok: true,
            data: {
                workspaces
            }
        })
    }

    async create (request, response) {
        const { title, image, description } = request.body
        const user_id = request.user.id
        const workspace = await workspaceRepository.create(user_id, title, image, description)
        await workspaceRepository.addMember(workspace._id, user_id, 'Owner')
        response.json({
            ok: true,
            data: {
                workspace
            }
        })
    }
}

const workspaceController = new WorkspaceController()
export default workspaceController