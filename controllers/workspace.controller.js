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
}

const workspaceController = new WorkspaceController()
export default workspaceController