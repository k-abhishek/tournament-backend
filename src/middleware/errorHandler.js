/**
 * Global Fastify error handler.
 * Normalises application errors and Prisma errors into consistent JSON responses.
 */
export async function errorHandler(error, req, reply) {
  req.log.error(error);

  // App-created errors (via createError utility)
  if (error.statusCode) {
    return reply.code(error.statusCode).send({
      error: error.message,
      statusCode: error.statusCode,
    });
  }

  // Prisma constraint violations
  if (error.code === 'P2002') {
    return reply.code(409).send({
      error: 'A record with this value already exists',
      statusCode: 409,
    });
  }

  if (error.code === 'P2025') {
    return reply.code(404).send({
      error: 'Record not found',
      statusCode: 404,
    });
  }

  // Fastify validation errors
  if (error.validation) {
    return reply.code(400).send({
      error: 'Validation failed',
      details: error.validation,
      statusCode: 400,
    });
  }

  // Fallback
  return reply.code(500).send({
    error: 'Internal Server Error',
    statusCode: 500,
  });
}
