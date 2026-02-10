import { Router } from "express";
import { generateDocument } from "../controllers/generate.controller";

const router = Router();

router.post("/generate/:documentTo", generateDocument);

export default router;
