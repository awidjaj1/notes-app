import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

/* READ */
// when client requests for a certain user (i.e. GET /users/id) 
// we first verify the JWT then call getUser controller
router.get("/:id", verifyToken, getUser);
// when client requests for a certain user's friends
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
// for partial update use PATCH (complete replacement of resource use PUT)
// TODO: maybe change the URI to /:id/friends and include the friendId in the req body?
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;