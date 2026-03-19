import express from "express";
import { generatePdf } from "../controllers/generate.controller";

const router = express.Router();

router.post("/generate", generatePdf);

export default router;
