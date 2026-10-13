/**
 * Generates a URL-friendly slug from a name string.
 * Appends a numeric suffix if the slug already exists (via the existence check fn).
 *
 * @param {string} name - Source string
 * @param {(slug: string) => Promise<any>} existsFn - Returns truthy if slug is taken
 */
export async function generateSlug(name, existsFn) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');

  let slug = base;
  let counter = 1;

  while (await existsFn(slug)) {
    slug = `${base}-${counter++}`;
  }

  return slug;
}
