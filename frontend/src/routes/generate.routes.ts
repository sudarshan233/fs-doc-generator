import express from "express";
import { generatePdf } from "../controllers/generate.controller";
import { generateTemplatePdf } from "../controllers/generate-template.controller";

const router = express.Router();

router.post("/generate", generatePdf);
router.post("/generate-template", generateTemplatePdf);

export default router;
