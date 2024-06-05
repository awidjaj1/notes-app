import express from "express";
import {login} from "../controllers/auth.js";

const router = express.Router();

//middleware for everytime you post to /auth/login
router.post("/login", login);

export default router;