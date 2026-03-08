import express from "express";
import { generateDoc, getLastPayload } from "../controllers/generate.controller";

const router = express.Router();

router.post("/generate", generateDoc);
router.get("/last-payload", getLastPayload);

export default router;