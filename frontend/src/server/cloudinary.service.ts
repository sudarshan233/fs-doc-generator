import dotenv from 'dotenv';
import { join } from 'node:path';

dotenv.config({ path: join(process.cwd(), 'src', '.env') });

type CloudinaryConfig = {
  cloud_name: string;
  api_key: string;
  api_secret: string;
};

const getCloudinaryConfig = (): CloudinaryConfig => {
  const cloud_name = process.env['CLOUDINARY_CLOUD_NAME'];
  const api_key = process.env['CLOUDINARY_API_KEY'];
  const api_secret = process.env['CLOUDINARY_API_SECRET'];

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      'Missing Cloudinary credentials. Make sure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are defined in src/.env.',
    );
  }

  return { cloud_name, api_key, api_secret };
};

export const uploadPdfToCloudinary = async (pdfPath: string): Promise<string> => {
  const { v2: cloudinary } = await import('cloudinary');

  cloudinary.config({
    ...getCloudinaryConfig(),
    secure: true,
  });

  const pdf = await cloudinary.uploader.upload(pdfPath, {
    resource_type: "raw",
    type: "upload",
    flags: 'attachment',
    folder: 'output',
    use_filename: true,
    unique_filename: true,
  });

  return pdf.secure_url;
};
