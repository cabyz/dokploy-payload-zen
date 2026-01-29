/**
 * API client for fetching data from Payload CMS
 * This replaces direct getPayload() calls for the edge frontend
 */

const CMS_URL = process.env.CMS_URL || 'https://cms.wlf.com.mx'

interface FetchOptions {
    draft?: boolean
    revalidate?: number
    depth?: number
}

// Generic fetch wrapper
async function fetchFromCMS<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { draft = false, revalidate = 60, depth = 1 } = options

    // Add depth to query params
    const separator = endpoint.includes('?') ? '&' : '?'
    const url = `${CMS_URL}/api/${endpoint}${separator}depth=${depth}`

    const fetchOptions: RequestInit = {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate },
    }

    if (draft) {
        fetchOptions.cache = 'no-store'
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
        console.error(`API error: ${response.status} for ${url}`)
        throw new Error(`API error: ${response.status}`)
    }

    return response.json()
}

// ============ COLLECTIONS ============

interface PaginatedResponse<T> {
    docs: T[]
    totalDocs: number
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export async function getPages(options?: FetchOptions) {
    return fetchFromCMS<PaginatedResponse<any>>('pages', options)
}

export async function getPageBySlug(slug: string, options?: FetchOptions) {
    const result = await fetchFromCMS<PaginatedResponse<any>>(
        `pages?where[slug][equals]=${slug}`,
        options
    )
    return result.docs[0] || null
}

export async function getPosts(options?: FetchOptions & { limit?: number }) {
    const limit = options?.limit || 10
    return fetchFromCMS<PaginatedResponse<any>>(`posts?limit=${limit}`, options)
}

export async function getPostBySlug(slug: string, options?: FetchOptions) {
    const result = await fetchFromCMS<PaginatedResponse<any>>(
        `posts?where[slug][equals]=${slug}`,
        options
    )
    return result.docs[0] || null
}

export async function getCategories(options?: FetchOptions) {
    return fetchFromCMS<PaginatedResponse<any>>('categories', options)
}

// ============ GLOBALS ============

export async function getGlobal<T = any>(
    slug: 'header' | 'footer',
    options?: FetchOptions
): Promise<T> {
    return fetchFromCMS<T>(`globals/${slug}`, options)
}

// Convenience aliases matching original API
export async function getHeader(options?: FetchOptions) {
    return getGlobal('header', options)
}

export async function getFooter(options?: FetchOptions) {
    return getGlobal('footer', options)
}

// ============ SEARCH ============

export async function searchContent(query: string, options?: FetchOptions) {
    return fetchFromCMS<PaginatedResponse<any>>(
        `search?where[or][0][title][like]=${query}&where[or][1][content][like]=${query}`,
        options
    )
}

// ============ LEGACY COMPATIBILITY ============
// These match the old api.ts signatures

export async function getPage(slug: string, options?: FetchOptions) {
    return fetchFromCMS<PaginatedResponse<any>>(
        `pages?where[slug][equals]=${slug}`,
        options
    )
}

export async function getGlobals(
    slug: 'header' | 'footer',
    options?: FetchOptions
) {
    return getGlobal(slug, options)
}
