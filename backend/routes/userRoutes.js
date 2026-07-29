import express from "express";
import { getConnections, getPubicProfile, toggleFollow } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.use(protect);

userRouter.get("/:username/connections", getConnections);
userRouter.get("/:username", getPubicProfile);

userRouter.post("/:username/follow", toggleFollow);

export default userRouter;