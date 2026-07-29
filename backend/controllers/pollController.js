import User from "../models/User.js";
import Poll from "../models/Poll.js";
import Comment from "../models/Comment.js";
import { shapePoll } from "../utils/pollShape.js";
import { withCounts } from "../utils/counts.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const POP = ["creator", "name username avatar"];

// bookmark id-set for logged-in user
const bookmarkSet = async (userId) => {
    const me = await User.findById(userId).select("bookmarks");
    return new Set((me?.bookmarks || []).map(String));
};
 
// to create poll
export const createPoll = async (req, res) => {
    try {
        const { question, type, category } = req.body;
        if (!question || !type) {
            return res.status(400).json({ message: "Question and type are required" });
        }

        let options = [];
        if (type === "yesno") {
            options = [{ text: "Yes" }, { text: "No" }];
        } else if (type === "single") {
            const parsed = JSON.parse(req.body.options || "[]");
            options = parsed
                .filter((t) => t && t.trim())
                .map((t) => ({ text: t.trim() }));
            if (options.length < 2)
                return res.status(400).json({ message: "Add at least 2 options" });
        } else if (type === "image") {
            if (!req.files || req.files.length < 2)
                return res.status(400).json({ message: "Add at least 2 images" });
            const urls = await Promise.all(
                req.files.map((f) => uploadToCloudinary(f.buffer)),
            );
            options = urls.map((image) => ({ image, text: "" }));
        }

        const poll = await Poll.create({
            question,
            type,
            category,
            options,
            creator: req.userId,
        });
        res.status(201).json(poll);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//helper function to shared list as for voted feed
export const sendList = async (filter, req, res) => {
    const polls = await Poll.find(filter).populate(...POP).sort("-createdAt");
    const set = await bookmarkSet(req.userId);
    const shaped = polls.map((p) => shapePoll(p, req.userId, set));
    res.json(await withCounts(shaped));
};

//listPolls get listed polls
export const listPolls = async (req, res) => {
    try {
        const filter = {};
        if (req.query.type && req.query.type !== "all")
            filter.type = req.query.type;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.feed === "following") {
            const me = await User.findById(req.userId).select("following");
            filter.creator = { $in: me?.following || [] };
        }

        await sendList(filter, req, res);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// to get own polls
export const getMyPolls = async (req, res) => {
    try {
        await sendList({ creator: req.userId }, req, res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// get votedpolls i.e the poll whih i voted on 
export const getVotedPolls = async (req, res) => {
    try {
        await sendList({ "votes.user": req.userId }, req, res);
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
};

// the polls i bookmarked on (GET)
export const getBookmarks = async (req, res) => {
    try {
        const me = await User.findById(req.userId).populate({
            path: "bookmarks",
            populate: {
                path: "creator",
                select: "name username avatar"
            }
        });

        const set = new Set((me?.bookmarks || []).map((p) => String(p._id)));
        const shaped = (me?.bookmarks || []).map((p) => shapePoll(p, req.userId, set));
        res.json(await withCounts(shaped));


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// to get the counts of polls per type
export const getTrending = async (req, res) => {
    try {

        const types = ["single", "yesno", "image", "rating", "open"];
        const counts = await Promise.all(types.map((t) => Poll.countDocuments({ type: t })));
        res.json(types.map((t, i) => ({
            type: t,
            count: counts[i]
        })));

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// to get single poll(used by shareable public view)
export const getPoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id).populate(...POP);
        if (!poll) return res.status(404).json({ message: "Poll not found" });

        // Prevent view increment if request specifies ?noview=true OR if the user is the creator
        const creatorId = poll.creator?._id || poll.creator;
        const isCreator = String(creatorId) === String(req.userId);
        const skipView = req.query.noview === "true";

        if (!isCreator && !skipView) {
            poll.views = (poll.views || 0) + 1; // count this view
            await poll.save();
        }

        const set = await bookmarkSet(req.userId);
        const [shaped] = await withCounts([shapePoll(poll, req.userId, set)]);
        res.json(shaped);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// to get creator-only stats 
export const getPollAnalytics = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id).populate(...POP);
        if (!poll) return res.status(404).json({ message: "Poll not found" });
        
        if(String(poll.creator._id) !== String(req.userId)) {
            return res.status(403).json({ message: "Forbidden Not your Poll" });
        }
        
       const shaped = shapePoll(poll, req.userId);
       const comments = await Comment.countDocuments({poll: poll._id});
       res.json({poll:shaped, comments});
       

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
