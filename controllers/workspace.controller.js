import ENVIRONMENT from "../config/environment.config.js";
import mail_transporter from "../config/mail.config.js";
import ServerError from "../helpers/error.helpers.js";
import userRepository from "../repository/user.repository.js";
import workspaceRepository from "../repository/workspace.repository.js";
import workspaceService from "../services/workspace.service.js";

import jwt from "jsonwebtoken";

class WorkspaceController {
  /* =========================
     OBTENER WORKSPACES DEL USUARIO
  ========================= */

  async getWorkspaces(request, response) {
    const user_id = request.user.id;

    const workspaces = await workspaceRepository.getWorkspacesByUserId(user_id);

    response.json({
      ok: true,
      data: {
        workspaces,
      },
    });
  }

  /* =========================
     CREAR WORKSPACE
  ========================= */

  async create(request, response) {
    const { title, image, description } = request.body;

    const user_id = request.user.id;

    const workspace = await workspaceRepository.create(
      user_id,
      title,
      image,
      description,
    );

    await workspaceRepository.addMember(workspace._id, user_id, "Owner");

    response.json({
      ok: true,
      data: {
        workspace,
      },
    });
  }

  /* =========================
     ELIMINAR WORKSPACE
  ========================= */

  async delete(request, response) {
    const user_id = request.user.id;

    const { workspace_id } = request.params;

    await workspaceService.deleteFromUser(workspace_id, user_id);

    response.json({
      ok: true,
      message: "Espacio de trabajo eliminado correctamente",
      data: null,
      status: 200,
    });
  }

  /* =========================
     OBTENER MIEMBROS DEL WORKSPACE
  ========================= */

  async getMembers(request, response) {
    try {
      const { workspace_id } = request.params;

      const members =
        await workspaceRepository.getMembersByWorkspaceId(workspace_id);

      return response.json({
        ok: true,
        status: 200,
        data: {
          members,
        },
      });
    } catch (error) {
      console.error(error);

      return response.json({
        ok: false,
        status: 500,
        message: "Error obteniendo miembros del workspace",
        data: null,
      });
    }
  }

  /* =========================
     ELIMINAR MIEMBRO DEL WORKSPACE
  ========================= */

  async removeMember(request, response) {
    try {
      const { member_id } = request.params;

      await workspaceRepository.removeMember(member_id);

      return response.json({
        ok: true,
        status: 200,
        message: "Miembro eliminado del workspace",
        data: null,
      });
    } catch (error) {
      console.error(error);

      return response.json({
        ok: false,
        status: 500,
        message: "Error eliminando miembro",
        data: null,
      });
    }
  }

  /* =========================
     ENVIAR INVITACIÓN A WORKSPACE
  ========================= */

  async addMemberRequest(request, response) {
    const { email, role } = request.body;

    const workspace = request.workspace;

    const user_to_invite = await userRepository.buscarUnoPorEmail(email);

    if (!user_to_invite) {
      throw new ServerError("El email del invitado no existe.", 404);
    }

    const already_member =
      await workspaceRepository.getMemberByWorkspaceIdAndUserId(
        workspace._id,
        user_to_invite._id,
      );

    if (already_member) {
      throw new ServerError(
        "El usuario ya es miembro de este espacio de trabajo",
        400,
      );
    }

    const token = jwt.sign(
      {
        id: user_to_invite._id,
        email,
        workspace: workspace._id,
        role,
      },
      ENVIRONMENT.JWT_SECRET_KEY,
    );

    await mail_transporter.sendMail({
      to: email,
      from: ENVIRONMENT.GMAIL_USERNAME,
      subject: `Has sido invitado a ${workspace.title}`,
      html: `
        <h1>Has sido invitado a participar en el espacio de trabajo: ${workspace.title}</h1>

        <p>Si no reconoces esta invitacion por favor desestima este mail</p>

        <p>Da click en "Aceptar invitacion" para unirte al workspace</p>

        <a href='${ENVIRONMENT.URL_FRONTEND}accept-invitation?token=${token}'>
          Aceptar invitacion
        </a>
      `,
    });

    return response.json({
      status: 201,
      ok: true,
      message: "Invitacion enviada",
      data: null,
    });
  }

  /* =========================
     ACEPTAR INVITACIÓN
  ========================= */

  async acceptInvitation(request, response) {
    try {
      const { token } = request.query;

      const payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY);

      const { id, workspace: workspace_id, role } = payload;

      await workspaceRepository.addMember(workspace_id, id, role);

      return response.json({
        ok: true,
        message: "Invitacion aceptada",
        data: null,
      });
    } catch (error) {
      console.error(error);

      return response.json({
        ok: false,
        status: 401,
        message: "Token de invitacion invalido",
        data: null,
      });
    }
  }

  /* =========================
     OBTENER WORKSPACE POR ID
  ========================= */

  async getById(request, response) {
    const { workspace, member } = request;

    response.json({
      ok: true,
      status: 200,
      data: {
        workspace,
        member,
      },
      message: "Espacio de trabajo seleccionado",
    });
  }

  /* =========================
     ACTUALIZAR WORKSPACE
  ========================= */

  async update(request, response) {
    try {
      const { workspace_id } = request.params;

      const { title, description, image } = request.body;

      const updated_workspace = await workspaceRepository.updateById(
        workspace_id,
        {
          title,
          description,
          image,
        },
      );

      return response.json({
        ok: true,
        status: 200,
        message: "Workspace actualizado correctamente",
        data: {
          workspace: updated_workspace,
        },
      });
    } catch (error) {
      console.error(error);

      return response.json({
        ok: false,
        status: 500,
        message: "Error actualizando workspace",
        data: null,
      });
    }
  }
}

const workspaceController = new WorkspaceController();

export default workspaceController;
