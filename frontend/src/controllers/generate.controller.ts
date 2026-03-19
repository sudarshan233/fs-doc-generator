import { mkdir, access, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { Request, Response } from 'express';

let lastPayload: Record<string, unknown> | null = null;
const outputDir = join(process.cwd(), 'output');

const sanitizeFileName = (value: string): string => {
  const cleaned = value
    .trim()
    .replace(/\.pdf$/i, '')
    .replace(/[^a-z0-9-_]+/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return cleaned || 'document';
};

const getUniquePdfPath = async (requestedFileName: string): Promise<string> => {
  await mkdir(outputDir, { recursive: true });

  const safeBaseName = sanitizeFileName(requestedFileName);
  let suffix = 0;

  while (true) {
    const fileName = suffix === 0 ? `${safeBaseName}.pdf` : `${safeBaseName}-${suffix}.pdf`;
    const filePath = join(outputDir, fileName);

    try {
      await access(filePath);
      suffix += 1;
    } catch {
      return filePath;
    }
  }
};

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

export const savePdfDocument = async (req: Request, res: Response) => {
  const requestedFileName = req.query['filename'];

  if (typeof requestedFileName !== 'string' || requestedFileName.trim() === '') {
    return res.status(400).json({ success: false, error: 'filename is required' });
  }

  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    return res.status(400).json({ success: false, error: 'PDF file body is required' });
  }

  const filePath = await getUniquePdfPath(requestedFileName);
  await writeFile(filePath, req.body);

  return res.status(201).json({
    success: true,
    fileName: basename(filePath),
    relativePath: `output/${basename(filePath)}`,
  });
};
