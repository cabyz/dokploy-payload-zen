/**
 * Cached global fetchers - replaces Payload SDK with REST API
 */
import { getGlobal } from '@/lib/api'

type GlobalSlug = 'header' | 'footer'

/**
 * Returns a function that fetches the global with caching
 * Signature matches the original: getCachedGlobal('header', 1)()
 */
export const getCachedGlobal = (slug: GlobalSlug, depth = 0) => {
  return async () => {
    return getGlobal(slug, { depth, revalidate: 60 })
  }
}
