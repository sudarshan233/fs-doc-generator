import express from "express";
import { generateDoc, getLastPayload, savePdfDocument } from "../controllers/generate.controller";

const router = express.Router();

router.post("/generate", generateDoc);
router.get("/last-payload", getLastPayload);
router.post("/documents", express.raw({ type: 'application/pdf', limit: '50mb' }), savePdfDocument);

export default router;
