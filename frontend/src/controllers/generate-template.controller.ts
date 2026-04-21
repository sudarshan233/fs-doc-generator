import { Request, Response } from 'express';

import { TemplatePayload } from '../app/models/template-payload';
import { generateDocFromTemplate } from '../server/pdf-generation.service';
import { uploadPdfToCloudinary } from '../server/cloudinary.service';

export const generateTemplatePdf = async (req: Request, res: Response): Promise<Response | void> => {
  const payload = req.body as TemplatePayload | undefined;

  if (!payload || !payload.template_type || !payload.filename) {
    return res.status(400).json({
      success: false,
      error: 'template_type, filename, and data are required',
    });
  }

  try {
    const file = await generateDocFromTemplate(payload);
    const url = await uploadPdfToCloudinary(file.relativePath);

    return res.status(201).json({
      success: true,
      message: 'Template PDF generated successfully',
      uploadedFiles: [
        {
          filename: file.fileName,
          type: payload.template_type,
          url,
        }
      ],
    });

  } catch (error) {
    console.error('Failed to generate Template PDF', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF',
    });
  }
};
