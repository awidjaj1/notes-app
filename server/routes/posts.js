import express from "express";
import {getFeedPosts, getUserPosts, likePost} from "../controllers/posts.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
// TODO: maybe change the uri to just /:userId
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
// TODO: maybe change the uri to just /:id ?
router.patch("/:id/like", verifyToken, likePost);

export default router;
