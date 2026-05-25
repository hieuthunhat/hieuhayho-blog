import * as cloudinaryLib from '../lib/cloudinary.js';
import type { UploadResult } from '../lib/cloudinary.js';

export const UploadsService = {
  uploadImage: (buffer: Buffer): Promise<UploadResult> => cloudinaryLib.uploadBuffer(buffer),
};
