import type { Context } from 'koa';
import { PostsService } from '../services/posts.service.js';
import { toApiSummary, toApiFull } from '../dto/posts.dto.js';
import { parsePostInput } from '../validators/posts.validator.js';

export const PostsController = {
  async listPublic(ctx: Context) {
    const posts = await PostsService.listPublished();
    ctx.body = posts.map(toApiSummary);
  },

  async getPublicBySlug(ctx: Context) {
    const doc = await PostsService.getPublishedBySlug(ctx.params.slug);
    ctx.body = toApiFull(doc);
  },

  async listAdmin(ctx: Context) {
    const posts = await PostsService.listAll();
    ctx.body = posts.map(toApiFull);
  },

  async getAdminBySlug(ctx: Context) {
    const doc = await PostsService.getBySlug(ctx.params.slug);
    ctx.body = toApiFull(doc);
  },

  async create(ctx: Context) {
    const input = parsePostInput(ctx.request.body);
    const created = await PostsService.create(input);
    ctx.status = 201;
    ctx.body = toApiFull(created);
  },

  async update(ctx: Context) {
    const input = parsePostInput(ctx.request.body);
    const updated = await PostsService.update(ctx.params.slug, input);
    ctx.body = toApiFull(updated);
  },

  async remove(ctx: Context) {
    await PostsService.remove(ctx.params.slug);
    ctx.body = { ok: true };
  },
};
