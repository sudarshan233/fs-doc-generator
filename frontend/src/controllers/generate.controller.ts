import { Request, Response } from "express";

let lastPayload: Record<string, unknown> | null = null;

export const generateDoc = (req: Request, res: Response) => {
  const { documentTo } = req.query;
  // Validate the input
  if (!documentTo) {
    return res.status(400).json({
      success: false,
      error: "documentTo is required"
    });
  }

  lastPayload = req.body ?? null;

  return res.status(200).json({
    success: true,
    message: `Document generated successfully for ${documentTo}`,
  });
};

export const getLastPayload = (_req: Request, res: Response) => {
  if (lastPayload == null) {
    return res.status(404).json({ success: false, error: "No payload available" });
  }
  return res.status(200).json(lastPayload);
};
