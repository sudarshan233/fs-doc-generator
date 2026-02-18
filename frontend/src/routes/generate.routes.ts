import express from "express";
import { generateDoc } from "../controllers/generate.controller";


const router = express.Router();

router.post("/generate", generateDoc)

export default router;