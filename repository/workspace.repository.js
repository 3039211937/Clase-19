import MemberWorkspace from "../models/MemberWorkspace.model.js";
import Workspace from "../models/workspace.model.js";

class WorkspaceRepository {
  /* =========================
     GET WORKSPACE BY ID
  ========================= */

  async getById(workspace_id) {
    return await Workspace.findById(workspace_id);
  }

  /* =========================
     GET WORKSPACES BY USER
  ========================= */

  async getWorkspacesByUserId(user_id) {
    const workspaces = await MemberWorkspace.find({
      fk_id_user: user_id,
    }).populate({
      path: "fk_id_workspace",
      match: { active: true },
    });

    const members_workspace = workspaces.filter(
      (member) => member.fk_id_workspace !== null,
    );

    return members_workspace.map((member_workspace) => ({
      member_id: member_workspace._id,
      member_role: member_workspace.role,
      member_id_user: member_workspace.fk_id_user,

      workspace_image: member_workspace.fk_id_workspace.image,
      workspace_title: member_workspace.fk_id_workspace.title,
      workspace_id: member_workspace.fk_id_workspace._id,
    }));
  }

  /* =========================
     CREATE WORKSPACE
  ========================= */

  async create(fk_id_owner, title, image, description) {
    const workspace = await Workspace.create({
      fk_id_owner,
      title,
      image,
      description,
    });

    return workspace;
  }

  /* =========================
     ADD MEMBER
  ========================= */

  async addMember(workspace_id, user_id, role) {
    const member = await MemberWorkspace.create({
      fk_id_workspace: workspace_id,
      fk_id_user: user_id,
      role,
    });

    return member;
  }

  /* =========================
     GET MEMBER BY WORKSPACE + USER
  ========================= */

  async getMemberByWorkspaceIdAndUserId(workspace_id, user_id) {
    return await MemberWorkspace.findOne({
      fk_id_workspace: workspace_id,
      fk_id_user: user_id,
    });
  }

  /* =========================
     GET MEMBERS BY WORKSPACE
  ========================= */

  async getMembersByWorkspaceId(workspace_id) {
    const members = await MemberWorkspace.find({
      fk_id_workspace: workspace_id,
    }).populate("fk_id_user");

    return members.map((member) => ({
      member_id: member._id,
      user_id: member.fk_id_user._id,
      email: member.fk_id_user.email,
      role: member.role,
    }));
  }

  /* =========================
     REMOVE MEMBER
  ========================= */

  async removeMember(member_id) {
    return await MemberWorkspace.findByIdAndDelete(member_id);
  }

  /* =========================
     SOFT DELETE WORKSPACE
  ========================= */

  async delete(workspace_id) {
    return await Workspace.findByIdAndUpdate(
      workspace_id,
      { active: false },
      { new: true },
    );
  }

  /* =========================
     UPDATE WORKSPACE
  ========================= */

  async updateById(workspace_id, data) {
    return await Workspace.findByIdAndUpdate(workspace_id, data, { new: true });
  }
}

const workspaceRepository = new WorkspaceRepository();

export default workspaceRepository;
