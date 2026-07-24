import express from "express";
import { createPoll, getPollAnalytics, getMyPolls, getBookmarks, getPoll, getTrending, getVotedPolls, listPolls } from "../controllers/pollController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";
import { removeVote, updatePoll, votePoll, closePoll, deletePoll, toggleBookmark } from "../controllers/voteController.js";



const pollRouter = express.Router();

pollRouter.use(protect);

pollRouter.get("/", listPolls);
pollRouter.post("/", upload.array("images", 5), createPoll);
pollRouter.get("/mine", getMyPolls);

pollRouter.get("/voted", getVotedPolls);
pollRouter.get("/bookmarks", getBookmarks);
pollRouter.get("/trending", getTrending);

pollRouter.get("/:id/analytics", getPollAnalytics);
pollRouter.get("/:id", getPoll);

// vote
pollRouter.post("/:id/vote", votePoll);
pollRouter.delete("/:id/vote", removeVote);
pollRouter.patch("/:id/closed", closePoll);

pollRouter.patch("/:id", updatePoll);
pollRouter.delete("/:id", deletePoll);
pollRouter.post("/:id/bookmark", toggleBookmark); 


export default pollRouter;