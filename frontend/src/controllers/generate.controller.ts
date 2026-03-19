import { Request, Response } from 'express';

import { GeneratePayload } from '../app/models/generate-payload';
import { generatePdfDocuments } from '../server/pdf-generation.service';

export const generatePdf = async (req: Request, res: Response): Promise<Response | void> => {
  const payload = req.body as GeneratePayload | undefined;

  if (!payload || !Array.isArray(payload.hbl_list) || payload.hbl_list.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'hbl_list is required',
    });
  }

  try {
    const { files } = await generatePdfDocuments(payload);
    const [firstFile] = files;

    return res.status(201).json({
      success: true,
      fileName: firstFile?.fileName ?? '',
      relativePath: firstFile?.relativePath ?? '',
      files,
    });
  } catch (error) {
    console.error('Failed to generate PDFs', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDFs',
    });
  }
};
