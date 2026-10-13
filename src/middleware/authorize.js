import { createError } from '../utils/errors.js';

/**
 * Returns a Fastify preHandler that checks whether req.user.role is included
 * in the provided allowed roles array.
 * @param {string[]} roles
 */
export function authorize(roles) {
  return async function (req) {
    if (!roles.includes(req.user?.role)) {
      throw createError(403, 'Insufficient permissions');
    }
  };
}
