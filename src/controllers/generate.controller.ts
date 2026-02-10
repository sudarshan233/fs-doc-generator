import { Request, Response } from "express";

export function generateDocument(req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    message: "Crafted Document Successfullly"
  });
}
