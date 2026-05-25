import type { Context } from 'koa';
import { UploadsService } from '../services/uploads.service.js';
import { httpError } from '../lib/http-error.js';

export const UploadsController = {
  async uploadImage(ctx: Context) {
    const file = (ctx.request as unknown as { file?: { buffer: Buffer } }).file;
    if (!file) {
      throw httpError(400, 'No file provided');
    }
    ctx.body = await UploadsService.uploadImage(file.buffer);
  },
};
