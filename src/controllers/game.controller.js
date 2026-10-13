import { prisma } from '../config/database.js';
import { createError } from '../utils/errors.js';
import { generateSlug } from '../utils/slug.js';
import { redisClient } from '../config/redis.js';

export class GameController {
  async list(req, reply) {
    const games = await prisma.game.findMany({ orderBy: { name: 'asc' } });
    const keys = await redisClient.keys('*');
    return reply.send({ games, keys });
  }

  async getBySlug(req, reply) {
    const game = await prisma.game.findUnique({ where: { slug: req.params.slug } });
    if (!game) throw createError(404, 'Game not found');
    return reply.send({ game });
  }

  async create(req, reply) {
    const { name, description, iconUrl } = req.body;
    const slug = await generateSlug(name, (s) => prisma.game.findUnique({ where: { slug: s } }));
    const game = await prisma.game.create({ data: { name, slug, description, iconUrl } });
    return reply.code(201).send({ game });
  }

  async update(req, reply) {
    const game = await prisma.game.update({ where: { id: req.params.id }, data: req.body });
    return reply.send({ game });
  }

  async remove(req, reply) {
    await prisma.game.delete({ where: { id: req.params.id } });
    return reply.code(204).send();
  }
}
