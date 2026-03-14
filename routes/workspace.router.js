import express from "express";
import workspaceController from "../controllers/workspace.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import workspaceMiddleware from "../middlewares/workspace.middleware.js";
import { channelController } from "../controllers/channel.controller.js";
import channelMiddleware from "../middlewares/channel.middleware.js";
import messagesController from "../controllers/messages.controller.js";

const workspaceRouter = express.Router();

/* =========================
   PUBLIC INVITATION ENDPOINT
   (NO AUTH / NO API KEY)
========================= */

workspaceRouter.get(
  "/members/accept-invitation",
  workspaceController.acceptInvitation,
);

/* =========================
   WORKSPACES
========================= */

workspaceRouter.get("/", authMiddleware, workspaceController.getWorkspaces);

workspaceRouter.post("/", authMiddleware, workspaceController.create);

workspaceRouter.get(
  "/:workspace_id",
  authMiddleware,
  workspaceMiddleware(),
  workspaceController.getById,
);

/* =========================
   UPDATE WORKSPACE
========================= */

workspaceRouter.put(
  "/:workspace_id",
  authMiddleware,
  workspaceMiddleware(["Owner", "Admin"]),
  workspaceController.update,
);

/* =========================
   DELETE WORKSPACE
========================= */

workspaceRouter.delete(
  "/:workspace_id",
  authMiddleware,
  workspaceMiddleware(["Owner", "Admin"]),
  workspaceController.delete,
);

/* =========================
   MEMBERS
========================= */

workspaceRouter.get(
  "/:workspace_id/members",
  authMiddleware,
  workspaceMiddleware(),
  workspaceController.getMembers,
);

workspaceRouter.delete(
  "/:workspace_id/members/:member_id",
  authMiddleware,
  workspaceMiddleware(["Owner", "Admin"]),
  workspaceController.removeMember,
);

/* =========================
   INVITE MEMBER
========================= */

workspaceRouter.post(
  "/:workspace_id/members",
  authMiddleware,
  workspaceMiddleware(["Owner", "Admin"]),
  workspaceController.addMemberRequest,
);

/* =========================
   CHANNELS
========================= */

workspaceRouter.get(
  "/:workspace_id/channels",
  authMiddleware,
  workspaceMiddleware(),
  channelController.getAllByWorkspaceId,
);

workspaceRouter.post(
  "/:workspace_id/channels",
  authMiddleware,
  workspaceMiddleware(["Owner", "Admin"]),
  channelController.create,
);

/* =========================
   CHANNEL MESSAGES
========================= */

workspaceRouter.post(
  "/:workspace_id/channels/:channel_id/messages",
  authMiddleware,
  workspaceMiddleware(),
  channelMiddleware,
  messagesController.create,
);

workspaceRouter.get(
  "/:workspace_id/channels/:channel_id/messages",
  authMiddleware,
  workspaceMiddleware(),
  channelMiddleware,
  messagesController.getByChannelId,
);

export default workspaceRouter;
