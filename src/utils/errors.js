/**
 * Creates an error object with a statusCode property that the error handler
 * recognises and converts to the appropriate HTTP response.
 */
export function createError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}
